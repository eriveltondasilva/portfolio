import { mkdir, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { createInterface } from 'node:readline/promises';
import { parseArgs } from 'node:util';

import { z } from 'zod';

import {
  POST_IMAGES_DIR,
  POST_META_FILE,
  PRIMARY_AUTHOR_SLUG,
  PostStatus,
} from '@/lib/constants';
import { POSTS_DIR } from '@/lib/paths';
import { postSchema } from '@/lib/schemas';

import { runScript } from './utils';
import { readAuthors, readSeries } from './utils/content';
import { readYaml } from './utils/files';
import { BuildError, formatZodError } from './utils/errors';
import { log } from './utils/logger';

const TEMPLATE_DIR = join(import.meta.dir, 'utils', 'templates', 'post');

type Validate = (value: string) => string | undefined;

interface Field {
  name: string;
  question: string;
  validate: Validate;
  defaultValue?: string;
}

interface ExistingPost {
  folder: string;
  slug?: string | undefined;
  series?: string | undefined;
  order?: number | undefined;
}

// Lenient on purpose: this script must work even if another post has invalid metadata.
const existingPostSchema = z.object({
  slug: z.string().optional(),
  series: z.string().optional(),
  order: z.number().optional(),
});

// # Helpers

// JSON strings are valid YAML scalars, so quoting is safe for titles with ":" or numeric slugs.
const yamlString = (value: string): string => JSON.stringify(value);
const yamlList = (items: readonly string[]): string =>
  `[${items.map(yamlString).join(', ')}]`;

const splitList = (value: string): string[] =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .slice(0, 120)
    .replace(/^-+|-+$/g, '');
}

// "sv-SE" formats as YYYY-MM-DD in the local time zone.
const today = (): string => new Date().toLocaleDateString('sv-SE');

function validateWith(
  schema: z.ZodType,
  parse: (value: string) => unknown = (v) => v,
): Validate {
  return (value) => {
    const result = schema.safeParse(parse(value));
    return result.success ? undefined : result.error.issues[0]?.message;
  };
}

function renderTemplate(
  template: string,
  values: Readonly<Record<string, string>>,
): string {
  const rendered = template
    .replace(/\{\{(\w+)\}\}/g, (match, key: string) =>
      Object.hasOwn(values, key) ? (values[key] ?? '') : match,
    )
    .replace(/\n{3,}/g, '\n\n')
    .trimEnd();

  const leftover = rendered.match(/\{\{\w+\}\}/);

  if (leftover)
    throw new Error(`Template has an unknown placeholder: ${leftover[0]}`);

  return `${rendered}\n`;
}

// # Existing posts

async function readExistingPosts(): Promise<ExistingPost[]> {
  const entries = await readdir(POSTS_DIR, { withFileTypes: true }).catch(
    () => [],
  );
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

// # Main

async function main(): Promise<void> {
  const { values: flags } = parseArgs({
    options: {
      title: { type: 'string' },
      slug: { type: 'string' },
      description: { type: 'string' },
      tags: { type: 'string' },
      authors: { type: 'string' },
      series: { type: 'string' },
      order: { type: 'string' },
    },
  });

  const [authors, series, existing] = await Promise.all([
    readAuthors(),
    readSeries(),
    readExistingPosts(),
  ]);

  const authorSlugs = new Set(authors.map(({ slug }) => slug));
  const seriesSlugs = new Set(series.map(({ slug }) => slug));

  const rl = createInterface({ input: process.stdin, output: process.stdout });

  // A flag skips its prompt; an invalid flag fails instead of re-asking.
  async function ask(field: Field): Promise<string> {
    const flagValue = flags[field.name as keyof typeof flags];

    if (flagValue !== undefined) {
      const error = field.validate(flagValue);

      if (error)
        throw new BuildError('new-post', [`--${field.name}: ${error}`]);

      return flagValue;
    }

    const suffix = field.defaultValue ? ` [${field.defaultValue}]` : '';

    while (true) {
      const answer = (await rl.question(`${field.question}${suffix}: `)).trim();
      const value = answer || field.defaultValue || '';
      const error = field.validate(value);

      if (!error) return value;

      console.error(`  ✖ ${error}`);
    }
  }

  try {
    log.section('New post');

    const title = await ask({
      name: 'title',
      question: 'Title',
      validate: validateWith(postSchema.shape.title),
    });

    const validateSlug = validateWith(postSchema.shape.slug);
    const slug = await ask({
      name: 'slug',
      question: 'Slug (also the folder name)',
      defaultValue: slugify(title),
      validate: (value) =>
        validateSlug(value) ??
        (existing.some((post) => post.folder === value || post.slug === value) ?
          'A post with this slug or folder already exists.'
        : undefined),
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
    const postAuthors = splitList(
      await ask({
        name: 'authors',
        question: `Authors (${[...authorSlugs].join(', ')})`,
        defaultValue:
          authorSlugs.has(PRIMARY_AUTHOR_SLUG) ? PRIMARY_AUTHOR_SLUG : (
            undefined
          ),
        validate: (value) => {
          const unknown = splitList(value).find(
            (author) => !authorSlugs.has(author),
          );

          return (
            validateAuthors(value) ??
            (unknown ? `Unknown author: "${unknown}".` : undefined)
          );
        },
      }),
    );

    let seriesSlug = '';
    let order: number | undefined;

    if (seriesSlugs.size > 0) {
      seriesSlug = await ask({
        name: 'series',
        question: `Series (${[...seriesSlugs].join(', ')}; blank for none)`,
        validate: (value) =>
          value === '' || seriesSlugs.has(value) ?
            undefined
          : `Unknown series: "${value}".`,
      });
    }

    if (seriesSlug) {
      const takenOrders = existing
        .filter((post) => post.series === seriesSlug)
        .map((post) => post.order ?? 0);

      order = Number(
        await ask({
          name: 'order',
          question: 'Order in the series',
          defaultValue: String(Math.max(0, ...takenOrders) + 1),
          validate: (value) => {
            const parsed = Number(value);

            if (!Number.isInteger(parsed) || parsed < 1)
              return 'Order must be a positive integer.';

            return takenOrders.includes(parsed) ?
                `Order ${parsed} is already used.`
              : undefined;
          },
        }),
      );
    }

    const publishedAt = today();

    // Final safety net: the generated meta.yml must pass the same schema the build uses.
    const result = postSchema.safeParse({
      slug,
      title,
      description,
      tags,
      authors: postAuthors,
      publishedAt,
      status: PostStatus.DRAFT,
      ...(seriesSlug ? { series: seriesSlug, order } : {}),
    });

    if (!result.success) {
      throw new BuildError('new-post', [
        formatZodError('generated metadata', result.error),
      ]);
    }

    const values = {
      slug: yamlString(slug),
      title: yamlString(title),
      description: yamlString(description),
      tags: yamlList(tags),
      authors: yamlList(postAuthors),
      publishedAt: yamlString(publishedAt),
      series:
        seriesSlug ? `series: ${yamlString(seriesSlug)}\norder: ${order}` : '',
    };

    const templateFiles = Array.from(
      new Bun.Glob('**/*').scanSync({ cwd: TEMPLATE_DIR, onlyFiles: true }),
    );

    if (templateFiles.length === 0)
      throw new Error(`No template files in ${TEMPLATE_DIR}`);

    const folderPath = join(POSTS_DIR, slug);

    for (const file of templateFiles) {
      const template = await Bun.file(join(TEMPLATE_DIR, file)).text();
      await Bun.write(join(folderPath, file), renderTemplate(template, values));
    }

    await mkdir(join(folderPath, POST_IMAGES_DIR), { recursive: true });

    log.section('Created');
    log.ok('post:', folderPath);
    log.detail(
      `Edit ${POST_META_FILE}, write the post and set "status: published" when ready.`,
    );
  } finally {
    rl.close();
  }
}

await runScript('Creating a new post', main);
