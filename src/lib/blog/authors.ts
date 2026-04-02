import { PRIMARY_AUTHOR_SLUG } from '@/lib/constants'
import authorsData from '@/content/authors/index.json'

import type { Author } from '@/types'

export function getAllAuthors(): Author[] {
  return authorsData as Author[]
}

export function getAuthorBySlug(slug: string): Author | null {
  return getAllAuthors().find((a) => a.slug === slug) ?? null
}

export function getPrimaryAuthor(): Author {
  const author = getAuthorBySlug(PRIMARY_AUTHOR_SLUG)

  if (!author) {
    throw new Error(`Author not found: ${PRIMARY_AUTHOR_SLUG}`)
  }

  return author
}

export function getAuthorsBySlugs(slugs: string[]): Author[] {
  const authors = getAllAuthors()
  return slugs
    .map((slug) => authors.find((a) => a.slug === slug))
    .filter((a): a is Author => a !== undefined)
}
