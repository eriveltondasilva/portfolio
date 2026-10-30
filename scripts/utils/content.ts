import { PRIMARY_AUTHOR_SLUG } from '@/lib/constants';
import { AUTHORS_SOURCE_FILE, SERIES_SOURCE_FILE } from '@/lib/paths';
import { authorSchema, seriesSchema } from '@/lib/schemas';

import { BuildError, throwIfErrors } from './errors';
import { checkUniqueSlugs, readValidatedYaml } from './validations';

import type { Author, Series } from '@/types';

// Build-time readers for the YAML sources. The app never reads these files:
// it imports the JSON indexes generated from them, so scripts that need
// authors or series must read the sources here instead of importing from src/lib/blog.

function toSlugEntries(items: readonly { slug: string }[], file: string) {
  return items.map(({ slug }, index) => ({
    slug,
    source: `${file}[${index}]`,
  }));
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
