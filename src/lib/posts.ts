import { dirname } from 'node:path'

import postsIndex from '../../content/posts-index.json'
import seriesIndex from '../../content/series-index.json'

import type { PostIndex, SeriesIndex } from '@/types'

export function getAllPosts(): PostIndex[] {
  return postsIndex
}

export function getAllSeries(): SeriesIndex[] {
  return seriesIndex
}

export async function getPostBySlug(slug: string) {
  const post = getAllPosts().find((p) => p.slug === slug)

  if (!post) return null

  const { default: Content } = await import(
    `../../${dirname(post.filePath)}/index.mdx`
  )
  return { Content, post }
}

export async function getSeriesBySlug(slug: string) {
  return getAllSeries().find((s) => s.slug === slug) ?? null
}
