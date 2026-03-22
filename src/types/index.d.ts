import { z } from 'zod'

import { authorSchema, postSchema, seriesSchema } from '@/lib/schemas'

import type { MDXContent } from 'mdx/types'

export type Series = z.infer<typeof seriesSchema>
export type Post = z.infer<typeof postSchema>
export type Author = z.infer<typeof authorSchema>

export interface SeriesPostRef {
  slug: string
  title: string
  order: number
}

export interface PostIndex extends Post {
  readingTime: number
  filePath: string
}

export interface SeriesIndex extends Series {
  posts: SeriesPostRef[]
}

export interface TagCount {
  tag: string
  count: number
}

export interface AdjacentPosts {
  prev: PostIndex | null
  next: PostIndex | null
}

export interface PostWithContent {
  Content: MDXContent
  meta: PostIndex
}
