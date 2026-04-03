import { dirname, basename } from 'node:path'

import postsIndex from '@/generated/indexes/posts.json'

import type { AdjacentPosts, PostIndex, PostWithContent } from '@/types'

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

  const postTags = new Set(post.tags)

  return getAllPosts()
    .filter(
      (post) =>
        post.slug !== slug && post.tags.some((tag) => postTags.has(tag)),
    )
    .toSorted((a, b) => {
      const scoreA = a.tags.filter((tag) => postTags.has(tag)).length
      const scoreB = b.tags.filter((tag) => postTags.has(tag)).length
      return scoreB - scoreA
    })
    .slice(0, limit)
}

export function getAdjacentPosts(slug: string): AdjacentPosts {
  const posts = getAllPosts()
  const index = posts.findIndex((post) => post.slug === slug)

  if (index === -1) return { prevPost: null, nextPost: null }

  return {
    prevPost: posts[index + 1] ?? null,
    nextPost: posts[index - 1] ?? null,
  }
}

export async function getPostWithContent(
  slug: string,
): Promise<PostWithContent | null> {
  const post = getPostBySlug(slug)

  if (!post) return null

  const { default: Content } = await import(
    `@/content/posts/${basename(dirname(post.filePath))}/index.mdx`
  )

  return { Content, meta: post }
}
