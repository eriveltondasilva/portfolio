import { PRIMARY_AUTHOR_SLUG } from '@/lib/constants'
import authorsData from '@/content/authors/index.json'

import type { Author } from '@/types'

export function getAllAuthors(): Author[] {
  return authorsData as Author[]
}

export function getAuthorBySlug(slug: string): Author | null {
  return getAllAuthors().find((author) => author.slug === slug) ?? null
}

export function getPrimaryAuthor(): Author {
  const author = getAuthorBySlug(PRIMARY_AUTHOR_SLUG)

  if (!author) {
    throw new Error(`Author not found: ${PRIMARY_AUTHOR_SLUG}`)
  }

  return author
}

export function getAuthorsBySlugs(slugs: string[]): Author[] {
  return slugs.map(getAuthorBySlug).filter((author): author is Author => author !== null)
}
