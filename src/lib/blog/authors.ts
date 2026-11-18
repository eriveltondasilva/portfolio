import authorsIndex from '@/generated/indexes/authors.json';
import { PRIMARY_AUTHOR_SLUG } from '@/lib/constants';

import 'server-only';

import type { Author } from '@/types';

const authors = authorsIndex as Author[];
const authorsBySlug = new Map(authors.map((author) => [author.slug, author]));

// ─────────────────────────────────────

function getAuthorBySlug(slug: string): Readonly<Author> | null {
  return authorsBySlug.get(slug) ?? null;
}

export function getAuthorsBySlugs(slugs: string[]): ReadonlyArray<Author> {
  return slugs.flatMap((slug) => authorsBySlug.get(slug) ?? []);
}

export function getPrimaryAuthor(): Readonly<Author> {
  const author = getAuthorBySlug(PRIMARY_AUTHOR_SLUG);

  if (!author) {
    throw new Error(`Author not found: ${PRIMARY_AUTHOR_SLUG}`);
  }

  return author;
}
