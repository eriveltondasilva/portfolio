import { mkdir, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { createInterface } from 'node:readline/promises';
import { parseArgs } from 'node:util';

import { YAML, file as bunFile, write as bunWrite, Glob } from 'bun';
import { z } from 'zod';

import { postSchema } from '@/lib/schemas';
import { POST_IMAGES_DIR, POST_META_FILE, PRIMARY_AUTHOR_SLUG } from '@/lib/constants';

import { POSTS_DIR } from './utils/paths';
import { runScript } from './utils/run-script';
import { readAuthors, readSeries } from './utils/content';
import { readYaml } from './utils/files';
import { BuildError, formatZodError, resolveAll } from './utils/errors';
import { createAsker } from './utils/prompts';
import { renderTemplate, yamlList, yamlString } from './utils/template';
import * as logger from './utils/logger';
import { slugify } from './utils/slug';

import type { Ask, Flags, Validate } from './utils/prompts';
import type { TemplateValues } from './utils/template';

const TEMPLATE_DIR = join(import.meta.dir, 'utils', 'templates');

const FLAG_OPTIONS = {
  title: { type: 'string' },
  slug: { type: 'string' },
  description: { type: 'string' },
  tags: { type: 'string' },
  authors: { type: 'string' },
  series: { type: 'string' },
  order: { type: 'string' },
} as const;

type FlagName = keyof typeof FLAG_OPTIONS;
type PostFlags = Flags<FlagName>;
type PostAsk = Ask<FlagName>;

interface ExistingPost {
  folder: string;
  slug?: string | undefined;
  series?: string | undefined;
  order?: number | undefined;
}

interface PostContext {
  authorSlugs: ReadonlySet<string>;
  seriesSlugs: ReadonlySet<string>;
  existing: readonly ExistingPost[];
}

interface PostInput {
  title: string;
  slug: string;
  description: string;
  tags: string[];
  authors: string[];
  series: { slug: string; order: number } | null;
}

const existingPostSchema = z.object({
  slug: z.string().optional(),
  series: z.string().optional(),
  order: z.number().optional(),
});

// # Helpers

const splitList = (value: string): string[] =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

// 'sv-SE' yields YYYY-MM-DD in local time; toISOString() is UTC and would return tomorrow's date after 21h in Brazil.
const today = (): string => new Date().toLocaleDateString('sv-SE');

const formatPostFolderName = (date: string, slug: string): string => `${date}-${slug}`;

function validateWith(schema: z.ZodType, parse: (value: string) => unknown = (v) => v): Validate {
  return (value) => {
    const result = schema.safeParse(parse(value));
    return result.success ? undefined : result.error.issues[0]?.message;
  };
}

// # Existing posts

async function readExistingPosts(): Promise<ExistingPost[]> {
  const entries = await readdir(POSTS_DIR, { withFileTypes: true }).catch(() => []);
  const folders = entries
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith('.'))
    .map((entry) => entry.name);

  return Promise.all(
    folders.map(async (folder): Promise<ExistingPost> => {
      try {
        const meta = existingPostSchema.safeParse(
          await readYaml(join(POSTS_DIR, folder, POST_META_FILE)),
        );

        return meta.success ? { folder, ...meta.data } : { folder };
      } catch {
        return { folder };
      }
    }),
  );
}

// # Prompts

async function askSeries(
  ask: PostAsk,
  flags: PostFlags,
  { seriesSlugs, existing }: PostContext,
): Promise<PostInput['series']> {
  let seriesSlug = '';

  if (seriesSlugs.size > 0 || flags.series !== undefined) {
    seriesSlug = await ask({
      name: 'series',
      question: `Series (${[...seriesSlugs].join(', ')}; blank for none)`,
      validate: (value) =>
        value === '' || seriesSlugs.has(value) ? undefined : `Unknown series: "${value}".`,
    });
  }

  if (!seriesSlug) {
    if (flags.order !== undefined) {
      throw new BuildError('new-post', ['--order: requires a series. Pass --series as well.']);
    }

    return null;
  }

  const takenOrders = existing
    .filter((post) => post.series === seriesSlug)
    .map((post) => post.order ?? 0);

  const order = Number(
    await ask({
      name: 'order',
      question: 'Order in the series',
      defaultValue: String(Math.max(0, ...takenOrders) + 1),
      validate: (value) => {
        const parsed = Number(value);

        if (!Number.isInteger(parsed) || parsed < 1) return 'Order must be a positive integer.';

        return takenOrders.includes(parsed) ? `Order ${parsed} is already used.` : undefined;
      },
    }),
  );

  return { slug: seriesSlug, order };
}

async function collectPostInput(
  ask: PostAsk,
  flags: PostFlags,
  context: PostContext,
  createdAt: string,
): Promise<PostInput> {
  const { authorSlugs, existing } = context;

  const title = await ask({
    name: 'title',
    question: 'Title',
    validate: validateWith(postSchema.shape.title),
  });

  const validateSlug = validateWith(postSchema.shape.slug);
  const slug = await ask({
    name: 'slug',
    question: 'Slug (used for metadata and folder name)',
    defaultValue: slugify(title),
    validate: (value) => {
      const formatError = validateSlug(value);
      if (formatError) return formatError;

      const targetFolder = formatPostFolderName(createdAt, value);
      const alreadyExists = existing.some(
        (post) => post.folder === targetFolder || post.folder === value || post.slug === value,
      );

      return alreadyExists ? 'A post with this slug or folder already exists.' : undefined;
    },
  });

  const description = await ask({
    name: 'description',
    question: 'Description',
    validate: validateWith(postSchema.shape.description),
  });

  const tags = splitList(
    await ask({
      name: 'tags',
      question: 'Tags (comma separated, kebab-case)',
      validate: validateWith(postSchema.shape.tags, splitList),
    }),
  );

  const validateAuthors = validateWith(postSchema.shape.authors, splitList);
  const authors = splitList(
    await ask({
      name: 'authors',
      question: `Authors (${[...authorSlugs].join(', ')})`,
      defaultValue: authorSlugs.has(PRIMARY_AUTHOR_SLUG) ? PRIMARY_AUTHOR_SLUG : undefined,
      validate: (value) => {
        const unknown = splitList(value).find((author) => !authorSlugs.has(author));

        return validateAuthors(value) ?? (unknown ? `Unknown author: "${unknown}".` : undefined);
      },
    }),
  );

  const series = await askSeries(ask, flags, context);

  return { title, slug, description, tags, authors, series };
}

// # Scaffold

function toTemplateValues(
  { title, slug, description, tags, authors, series }: PostInput,
  publishedAt: string,
): TemplateValues {
  return {
    slug: yamlString(slug),
    title: yamlString(title),
    description: yamlString(description),
    tags: yamlList(tags),
    authors: yamlList(authors),
    publishedAt: yamlString(publishedAt),
    series: series ? yamlString(series.slug) : undefined,
    order: series ? String(series.order) : undefined,
  };
}

// Validates the file that will actually be written, so the check cannot drift from the template.
function assertValidMeta(content: string): void {
  const result = postSchema.safeParse(YAML.parse(content));

  if (!result.success) {
    throw new BuildError('new-post', [formatZodError('generated metadata', result.error)]);
  }
}

async function scaffoldPost(folderName: string, values: TemplateValues): Promise<string> {
  const templateFiles = Array.from(
    new Glob('**/*').scanSync({ cwd: TEMPLATE_DIR, onlyFiles: true }),
  );

  if (templateFiles.length === 0) throw new Error(`No template files in ${TEMPLATE_DIR}`);

  // Render and validate everything before writing: a template error must not leave a
  // half-created folder, since an existing folder blocks the slug on the next run.
  const rendered = await Promise.all(
    templateFiles.map(async (file) => ({
      file,
      content: renderTemplate(await bunFile(join(TEMPLATE_DIR, file)).text(), values),
    })),
  );

  const meta = rendered.find(({ file }) => file === POST_META_FILE);

  if (!meta) throw new Error(`${POST_META_FILE} not found in ${TEMPLATE_DIR}`);

  assertValidMeta(meta.content);

  const folderPath = join(POSTS_DIR, folderName);

  for (const { file, content } of rendered) {
    await bunWrite(join(folderPath, file), content);
  }

  await mkdir(join(folderPath, POST_IMAGES_DIR), { recursive: true });

  return folderPath;
}

// # Main

async function main(): Promise<void> {
  const { values: flags } = parseArgs({ options: FLAG_OPTIONS });

  const [authors, series, existing] = await resolveAll(
    readAuthors(),
    readSeries(),
    readExistingPosts(),
  );

  const context: PostContext = {
    authorSlugs: new Set(authors.map(({ slug }) => slug)),
    seriesSlugs: new Set(series.map(({ slug }) => slug)),
    existing,
  };

  const rl = createInterface({ input: process.stdin, output: process.stdout });

  try {
    logger.section('New post');

    const createdAt = today();
    const ask = createAsker<FlagName>(rl, flags, 'new-post');
    const input = await collectPostInput(ask, flags, context, createdAt);

    const templateValues = toTemplateValues(input, createdAt);
    const folderName = formatPostFolderName(createdAt, input.slug);
    const folderPath = await scaffoldPost(folderName, templateValues);

    logger.section('Created');
    logger.ok('post:', folderPath);
    logger.detail(
      `Edit ${POST_META_FILE}, write the post, then set "status: published" and update "publishedAt" to the publish date.`,
    );
  } finally {
    rl.close();
  }
}

await runScript('Creating a new post', main);
