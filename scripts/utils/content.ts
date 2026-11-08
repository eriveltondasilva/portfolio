import { PRIMARY_AUTHOR_SLUG } from '@/lib/constants';
import { authorSchema, seriesSchema } from '@/lib/schemas';

import { AUTHORS_SOURCE_FILE, SERIES_SOURCE_FILE } from './paths';
import { BuildError, throwIfErrors, formatZodError } from './errors';
import { checkUniqueSlugs } from './validations';
import { readYaml } from './files';

import type { Author, Series } from '@/types';
import type { z } from 'zod';

function toSlugEntries(items: readonly { slug: string }[], file: string) {
  return items.map(({ slug }, index) => ({
    slug,
    source: `${file}[${index}]`,
  }));
}

async function readValidatedYaml<T extends z.ZodType>(
  context: string,
  filePath: string,
  schema: T,
): Promise<z.output<T>> {
  const result = schema.safeParse(await readYaml(filePath));

  if (!result.success)
    throw new BuildError(context, [formatZodError(filePath, result.error)]);

  return result.data;
}

export async function readAuthors(): Promise<Author[]> {
  const authors = await readValidatedYaml(
    'authors',
    AUTHORS_SOURCE_FILE,
    authorSchema.array(),
  );

  throwIfErrors(
    'authors',
    checkUniqueSlugs(toSlugEntries(authors, AUTHORS_SOURCE_FILE)),
  );

  return authors;
}

export async function readSeries(): Promise<Series[]> {
  const series = await readValidatedYaml(
    'series',
    SERIES_SOURCE_FILE,
    seriesSchema.array(),
  );

  throwIfErrors(
    'series',
    checkUniqueSlugs(toSlugEntries(series, SERIES_SOURCE_FILE)),
  );

  return series;
}

export async function readPrimaryAuthor(): Promise<Author> {
  const authors = await readAuthors();
  const author = authors.find(({ slug }) => slug === PRIMARY_AUTHOR_SLUG);

  if (!author) {
    throw new BuildError('authors', [
      `Primary author "${PRIMARY_AUTHOR_SLUG}" not found in ${AUTHORS_SOURCE_FILE}`,
    ]);
  }

  return author;
}
