import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { cwd } from 'node:process'

import matter from 'gray-matter'

import seriesIndex from '../../content/series-index.json'
import postsIndex from '../../content/posts-index.json'

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

  const raw = await readFile(join(cwd(), post.filePath), 'utf-8')
  const { content } = matter(raw)

  return { meta: post, content }
}
getPostBySlug('')

export async function getSeriesBySlug(slug: string) {
  return getAllSeries().find((s) => s.slug === slug) ?? null
}
