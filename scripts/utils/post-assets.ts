import { readdir } from 'node:fs/promises';
import { join } from 'node:path';

import {
  POST_CONTENT_FILE,
  POST_IMAGES_DIR,
  POST_META_FILE,
} from '@/lib/constants';
import { stripFencedCode } from '@/lib/headings';

// Keep in sync with COVER_FILE_NAME below.
export const COVER_GLOB = 'cover.{jpg,jpeg,png,webp,avif}';

const COVER_FILE_NAME = /^cover\.(?:jpe?g|png|webp|avif)$/;
const IMAGE_EXTENSION = /\.(?:png|jpe?g|webp|avif|gif|svg)$/i;
const KEBAB_SEGMENT = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const KEBAB_FILE_NAME = /^[a-z0-9]+(?:-[a-z0-9]+)*\.[a-z0-9]+$/;

const MAX_IMAGE_BYTES = 1024 * 1024;
const IMAGES_PREFIX = `./${POST_IMAGES_DIR}/`;
const ALLOWED_ROOT_ENTRIES = new Set([
  POST_META_FILE,
  POST_CONTENT_FILE,
  POST_IMAGES_DIR,
]);

const MARKDOWN_IMAGE = /!\[[^\]]*\]\(\s*<?([^)\s>]+)/g;
const TAG_WITH_SRC = /<([A-Za-z][\w.]*)\b[^>]*?\bsrc=(?:"([^"]+)"|'([^']+)')/g;
const IMAGE_IMPORT = /^import\s[^'"\n]*?from\s+['"]([^'"]+)['"]/gm;

interface ImageReference {
  kind: 'markdown' | 'html' | 'jsx' | 'import';
  path: string;
}

export interface AssetReport {
  errors: string[];
  warnings: string[];
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

  for (const [, tag = '', doubleQuoted, singleQuoted] of source.matchAll(
    TAG_WITH_SRC,
  )) {
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

function listImageFiles(folderPath: string): string[] {
  const imagesDir = join(folderPath, POST_IMAGES_DIR);

  try {
    const glob = new Bun.Glob('**/*');

    return Array.from(glob.scanSync({ cwd: imagesDir, onlyFiles: true }))
      .map((file) => file.replaceAll('\\', '/'))
      .toSorted();
  } catch {
    return []; // the post has no images folder
  }
}

function inspectRootEntries(entries: readonly string[]): AssetReport {
  const report: AssetReport = { errors: [], warnings: [] };

  for (const name of entries) {
    if (name.startsWith('.')) continue;
    if (ALLOWED_ROOT_ENTRIES.has(name) || COVER_FILE_NAME.test(name)) continue;

    if (/^cover\./i.test(name)) {
      // A wrong-case cover would silently not be found by the case-sensitive glob.
      report.errors.push(
        `"${name}": the cover must be named like "cover.png" (lowercase).`,
      );
      continue;
    }

    const allowed = [...ALLOWED_ROOT_ENTRIES, 'cover.<ext>'].join(', ');
    report.warnings.push(
      `unexpected entry "${name}" in the post folder (allowed: ${allowed}).`,
    );
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
export async function inspectPostAssets(
  folderPath: string,
  content: string,
): Promise<AssetReport> {
  const { errors, warnings } = inspectRootEntries(await readdir(folderPath));

  const files = listImageFiles(folderPath);
  const imagePaths = new Set(files.map((file) => `${POST_IMAGES_DIR}/${file}`));

  for (const file of files) {
    const segments = file.split('/');
    const name = segments.at(-1) ?? '';
    const isValidName =
      KEBAB_FILE_NAME.test(name) &&
      segments.slice(0, -1).every((part) => KEBAB_SEGMENT.test(part));

    if (!isValidName) {
      errors.push(
        `${POST_IMAGES_DIR}/${file}: use lowercase letters, numbers and hyphens (e.g. "my-image.png"). ` +
          'Case differences work on macOS/Windows but break the build on Linux.',
      );
    }

    const { size } = Bun.file(join(folderPath, POST_IMAGES_DIR, file));

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

    const relativePath = path.slice(2);

    if (imagePaths.has(relativePath)) used.add(relativePath);
    else
      errors.push(
        `${path}: file not found (names are case-sensitive on Linux).`,
      );
  }

  for (const path of imagePaths) {
    if (!used.has(path))
      warnings.push(`${path}: not referenced in ${POST_CONTENT_FILE}.`);
  }

  return { errors, warnings };
}
