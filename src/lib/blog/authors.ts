import authorsIndex from '@/generated/indexes/authors.json';
import { PRIMARY_AUTHOR_SLUG } from '@/lib/constants';

import type { Author } from '@/types';

const authors = authorsIndex as Author[];
const authorsBySlug = new Map(authors.map((author) => [author.slug, author]));

export function getAllAuthors(): Author[] {
  return [...authors];
}

export function getAuthorBySlug(slug: string): Author | null {
  return authorsBySlug.get(slug) ?? null;
}

export function getPrimaryAuthor(): Author {
  const author = getAuthorBySlug(PRIMARY_AUTHOR_SLUG);

  if (!author) {
    throw new Error(`Author not found: ${PRIMARY_AUTHOR_SLUG}`);
  }

  return author;
}

export function getAuthorsBySlugs(slugs: string[]): Author[] {
  return slugs.flatMap((slug) => authorsBySlug.get(slug) ?? []);
}
