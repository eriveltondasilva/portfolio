import { dirname } from 'node:path'

import postsIndex from '@/posts-index.json'
import seriesIndex from '@/series-index.json'

import type { PostIndex, SeriesIndex } from '@/types'
import type { MDXContent } from 'mdx/types'

// # BASE

export function getAllPosts() {
  return postsIndex as PostIndex[]
}

export function getAllSeries() {
  return seriesIndex as SeriesIndex[]
}

// # POSTS

export function getPostBySlug(slug: string) {
  return getAllPosts().find((p) => p.slug === slug) ?? null
}

export function getRecentPosts(limit = 5) {
  return getAllPosts().slice(0, limit)
}

export function getPostsByTag(tag: string) {
  return getAllPosts().filter((p) => p.tags.includes(tag))
}

export function getPostsBySeries(seriesSlug: string): PostIndex[] {
  return getAllPosts()
    .filter((p) => p.series === seriesSlug)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
}

export function getRelatedPosts(slug: string, limit = 3): PostIndex[] {
  const post = getPostBySlug(slug)
  if (!post) return []

  return getAllPosts()
    .filter((p) => p.slug !== slug && p.tags.some((t) => post.tags.includes(t)))
    .sort((a, b) => {
      const scoreA = a.tags.filter((t) => post.tags.includes(t)).length
      const scoreB = b.tags.filter((t) => post.tags.includes(t)).length
      return scoreB - scoreA
    })
    .slice(0, limit)
}

export function getAdjacentPosts(slug: string): {
  prev: PostIndex | null
  next: PostIndex | null
} {
  const posts = getAllPosts()
  const index = posts.findIndex((p) => p.slug === slug)

  if (index === -1) return { prev: null, next: null }

  return {
    prev: posts[index + 1] ?? null,
    next: posts[index - 1] ?? null,
  }
}

// # TAGS

export function getAllTags() {
  return [...new Set(getAllPosts().flatMap((p) => p.tags))].toSorted()
}

export function getTagsWithCount() {
  return getAllPosts()
    .flatMap((p) => p.tags)
    .reduce<Record<string, number>>((acc, tag) => {
      acc[tag] = (acc[tag] ?? 0) + 1
      return acc
    }, {})
}

// # SERIES

export function getSeriesBySlug(slug: string) {
  return getAllSeries().find((s) => s.slug === slug) ?? null
}

// # CONTENT

export async function getPostWithContent(slug: string) {
  const post = getPostBySlug(slug)
  if (!post) return null

  const { default: Content } = (await import(
    `../../${dirname(post.filePath)}/index.mdx`
  )) as { default: MDXContent }

  return { Content, post }
}
