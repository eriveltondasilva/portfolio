import { dirname } from 'node:path'

import authorsData from '@/authors/index.json'
import postsIndex from '@/indexes/posts.json'
import seriesIndex from '@/indexes/series.json'
import projectsIndex from '@/indexes/projects.json'
import { PRIMARY_AUTHOR_SLUG, SeriesStatus } from '@/lib/constants'

import type {
  AdjacentPosts,
  Author,
  Project,
  PostIndex,
  PostWithContent,
  SeriesIndex,
  TagCount,
} from '@/types'

// # AUTHORS

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

// # POSTS

export function getAllPosts(): PostIndex[] {
  return postsIndex as PostIndex[]
}

export function getPostBySlug(slug: string): PostIndex | null {
  return getAllPosts().find((post) => post.slug === slug) ?? null
}

export function getRecentPosts(limit = 4): PostIndex[] {
  return getAllPosts().slice(0, limit)
}

export function getPostsByTag(tag: string): PostIndex[] {
  return getAllPosts().filter((post) => post.tags.includes(tag))
}

export function getPostsByAuthor(authorSlug: string): PostIndex[] {
  return getAllPosts().filter((post) => post.authors.includes(authorSlug))
}

export function getPostsBySeries(seriesSlug: string): PostIndex[] {
  return getAllPosts().filter((post) => post.series === seriesSlug)
}

export function getRelatedPosts(slug: string, limit = 3): PostIndex[] {
  const post = getPostBySlug(slug)

  if (!post) return []

  return getAllPosts()
    .filter((p) => p.slug !== slug && p.tags.some((t) => post.tags.includes(t)))
    .toSorted((a, b) => {
      const scoreA = a.tags.filter((t) => post.tags.includes(t)).length
      const scoreB = b.tags.filter((t) => post.tags.includes(t)).length
      return scoreB - scoreA
    })
    .slice(0, limit)
}

export function getAdjacentPosts(slug: string): AdjacentPosts {
  const posts = getAllPosts()
  const index = posts.findIndex((post) => post.slug === slug)

  if (index === -1) return { prev: null, next: null }

  return {
    prev: posts[index + 1] ?? null,
    next: posts[index - 1] ?? null,
  }
}

export async function getPostWithContent(
  slug: string,
): Promise<PostWithContent | null> {
  const post = getPostBySlug(slug)

  if (!post) return null

  const { default: Content } = await import(
    `../../${dirname(post.filePath)}/index.mdx`
  )

  return { Content, meta: post }
}

// # TAGS

function buildTagCounts(): Record<string, number> {
  return getAllPosts()
    .flatMap((post) => post.tags)
    .reduce<Record<string, number>>((acc, tag) => {
      acc[tag] = (acc[tag] ?? 0) + 1
      return acc
    }, {})
}

export function getAllTags(): string[] {
  return Object.keys(buildTagCounts()).toSorted()
}

export function getTagsWithCount(): TagCount[] {
  return Object.entries(buildTagCounts())
    .map(([tag, count]) => ({ tag, count }))
    .toSorted((a, b) => b.count - a.count)
}

// # SERIES

export function getAllSeries(): SeriesIndex[] {
  return seriesIndex as SeriesIndex[]
}

export function getSeriesBySlug(slug: string): SeriesIndex | null {
  return getAllSeries().find((series) => series.slug === slug) ?? null
}

/** Retorna séries com status IN_PROGRESS, usadas na home. */
export function getRecentSeries(limit = 2): SeriesIndex[] {
  return getAllSeries()
    .filter((series) => series.status === SeriesStatus.IN_PROGRESS)
    .slice(0, limit)
}

// # PROJECTS

export function getAllProjects(): Project[] {
  return projectsIndex as Project[]
}

export function getFeaturedProjects(): Project[] {
  return getAllProjects().filter((p) => p.featured)
}
