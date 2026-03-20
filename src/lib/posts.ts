import { dirname } from 'node:path'

import postsIndex from '@/posts-index.json'
import seriesIndex from '@/series-index.json'

import type { PostIndex, SeriesIndex } from '@/types'
import type { MDXContent } from 'mdx/types'

interface TagCount {
  tag: string
  count: number
}

interface AdjacentPosts {
  prev: PostIndex | null
  next: PostIndex | null
}

interface PostWithContent {
  Content: MDXContent
  meta: PostIndex
}

// # BASE

export function getAllPosts(): PostIndex[] {
  return postsIndex as PostIndex[]
}

export function getAllSeries(): SeriesIndex[] {
  return seriesIndex as SeriesIndex[]
}

// # POSTS

export function getPostBySlug(slug: string): PostIndex | null {
  return getAllPosts().find((post) => post.slug === slug) ?? null
}

export function getRecentPosts(limit = 5): PostIndex[] {
  return getAllPosts().slice(0, limit)
}

export function getPostsByTag(tag: string): PostIndex[] {
  return getAllPosts().filter((post) => post.tags.includes(tag))
}

export function getPostsByAuthor(authorSlug: string): PostIndex[] {
  return getAllPosts().filter((post) => post.authors.includes(authorSlug))
}

export function getPostsBySeries(seriesSlug: string): PostIndex[] {
  return getAllPosts()
    .filter((post) => post.series === seriesSlug)
    .toSorted((a, b) => (a.order ?? 0) - (b.order ?? 0))
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

export function getSeriesBySlug(slug: string): SeriesIndex | null {
  return getAllSeries().find((series) => series.slug === slug) ?? null
}

// # CONTENT

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
