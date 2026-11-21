import { readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';

import { POST_CONTENT_FILE, POST_IMAGES_DIR, POST_META_FILE } from '@/lib/constants';

const COVER_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'avif'];
const COVER_FILE_NAME = new RegExp(`^cover\\.(?:${COVER_EXTENSIONS.join('|')})$`);
const IMAGE_EXTENSION = /\.(?:png|jpe?g|webp|avif|gif|svg)$/i;
const KEBAB_SEGMENT = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const KEBAB_FILE_NAME = /^[a-z0-9]+(?:-[a-z0-9]+)*\.[a-z0-9]+$/;

const MAX_IMAGE_BYTES = 1024 * 1024; // 1 MB
const IMAGES_PREFIX = `./${POST_IMAGES_DIR}/`;
const ALLOWED_ROOT_ENTRIES = new Set([POST_META_FILE, POST_CONTENT_FILE, POST_IMAGES_DIR]);

const MARKDOWN_IMAGE = /!\[[^\]]*\]\(\s*<?([^)\s>]+)/g;
const TAG_WITH_SRC = /<([A-Za-z][\w.]*)\b[^>]*?\bsrc=(?:"([^"]+)"|'([^']+)')/g;
const IMAGE_IMPORT = /^import\s[^'"\n]*?from\s+['"]([^'"]+)['"]/gm;

/**
 * A fence may be indented (e.g. inside a list) and is closed only by a fence of the same
 * character with at least as many characters, so a 4-backtick block can wrap a 3-backtick one.
 */
const FENCED_CODE_REGEX = /^[ \t]*(`{3,}|~{3,})[^\n]*\n[\s\S]*?^[ \t]*\1[`~]*[ \t]*$/gm;

function stripFencedCode(content: string): string {
  return content.replace(FENCED_CODE_REGEX, '');
}

interface ImageReference {
  kind: 'markdown' | 'html' | 'jsx' | 'import';
  path: string;
}

interface ImageFile {
  path: string;
  size: number;
}

export interface AssetReport {
  errors: string[];
  warnings: string[];
  coverFile: string | null;
}

// # References

function stripNonContent(content: string): string {
  return stripFencedCode(content)
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, '') // MDX comments
    .replace(/`[^`\n]*`/g, ''); // inline code
}

function isLocalPath(path: string): boolean {
  return !/^(?:[a-z][a-z0-9+.-]*:|\/|#)/i.test(path);
}

function collectImageReferences(content: string): ImageReference[] {
  const source = stripNonContent(content);
  const references: ImageReference[] = [];

  for (const [, path = ''] of source.matchAll(MARKDOWN_IMAGE)) {
    references.push({ kind: 'markdown', path });
  }

  for (const [, tag = '', doubleQuoted, singleQuoted] of source.matchAll(TAG_WITH_SRC)) {
    references.push({
      kind: /^[A-Z]/.test(tag) ? 'jsx' : 'html',
      path: doubleQuoted ?? singleQuoted ?? '',
    });
  }

  for (const [, path = ''] of source.matchAll(IMAGE_IMPORT)) {
    references.push({ kind: 'import', path });
  }

  return references
    .map(({ kind, path }) => ({ kind, path: path.replace(/[?#].*$/, '') }))
    .filter(({ path }) => isLocalPath(path) && IMAGE_EXTENSION.test(path));
}

// # Files

async function listImageFiles(folderPath: string): Promise<ImageFile[]> {
  const imagesDir = join(folderPath, POST_IMAGES_DIR);
  const entries = await readdir(imagesDir, { recursive: true }).catch(() => []);

  const candidates = await Promise.all(
    entries.map(async (entry) => ({
      path: entry.replaceAll('\\', '/'),
      stats: await stat(join(imagesDir, entry)),
    })),
  );

  // Hidden entries (e.g. .DS_Store) are not images, same as the Glob this replaced.
  return candidates
    .filter(({ path, stats }) => stats.isFile() && !path.split('/').some((s) => s.startsWith('.')))
    .map(({ path, stats }) => ({ path, size: stats.size }))
    .toSorted((a, b) => a.path.localeCompare(b.path));
}

function inspectRootEntries(entries: readonly string[]): AssetReport {
  const covers = entries.filter((name) => COVER_FILE_NAME.test(name));
  const report: AssetReport = { errors: [], warnings: [], coverFile: covers[0] ?? null };

  if (covers.length > 1) {
    report.errors.push(`more than one cover found (${covers.join(', ')}); keep only one.`);
  }

  for (const name of entries) {
    if (name.startsWith('.')) continue;
    if (ALLOWED_ROOT_ENTRIES.has(name) || COVER_FILE_NAME.test(name)) continue;

    if (/^cover\./i.test(name)) {
      report.errors.push(
        `"${name}": the cover must be named "cover.<ext>" in lowercase (${COVER_EXTENSIONS.join(', ')}).`,
      );
      continue;
    }

    const allowed = [...ALLOWED_ROOT_ENTRIES, 'cover.<ext>'].join(', ');
    report.warnings.push(`unexpected entry "${name}" in the post folder (allowed: ${allowed}).`);
  }

  return report;
}

// # Inspection

/**
 * Enforces the post folder conventions: images live in `images/`, are referenced as
 * `./images/name.ext`, use lowercase kebab-case names and are actually used.
 *
 * rehype-mdx-import-media imports every relative path and has no folder option,
 * so the pattern is enforced here, before the Next.js build.
 */
export async function inspectPostAssets(folderPath: string, content: string): Promise<AssetReport> {
  const entries = await readdir(folderPath);
  const { errors, warnings, coverFile } = inspectRootEntries(entries);

  const files = await listImageFiles(folderPath);
  const imagePaths = new Set(files.map(({ path }) => `${IMAGES_PREFIX}${path}`));

  for (const { path: file, size } of files) {
    const segments = file.split('/');
    const name = segments.at(-1) ?? '';
    const isValidName =
      KEBAB_FILE_NAME.test(name) && segments.slice(0, -1).every((part) => KEBAB_SEGMENT.test(part));

    if (!isValidName) {
      errors.push(
        `${POST_IMAGES_DIR}/${file}: use lowercase letters, numbers and hyphens (e.g. "my-image.png"). ` +
          'Case differences work on macOS/Windows but break the build on Linux.',
      );
    }

    if (size > MAX_IMAGE_BYTES) {
      warnings.push(
        `${POST_IMAGES_DIR}/${file}: ${(size / 1024 / 1024).toFixed(1)} MB, consider compressing it.`,
      );
    }
  }

  const used = new Set<string>();

  for (const { kind, path } of collectImageReferences(content)) {
    if (kind === 'jsx') {
      errors.push(
        `${path}: a string src on a JSX component is not imported. ` +
          'Import the image (import x from "./images/...") and pass src={x}.',
      );
      continue;
    }

    if (!path.startsWith(IMAGES_PREFIX)) {
      errors.push(
        `${path}: images must live in "${POST_IMAGES_DIR}/" and be referenced as "${IMAGES_PREFIX}name.ext".`,
      );
      continue;
    }

    if (imagePaths.has(path)) used.add(path);
    else errors.push(`${path}: file not found (names are case-sensitive on Linux).`);
  }

  for (const path of imagePaths) {
    if (!used.has(path)) warnings.push(`${path}: not referenced in ${POST_CONTENT_FILE}.`);
  }

  return { errors, warnings, coverFile };
}
