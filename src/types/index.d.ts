import { z } from 'zod'

import {
  authorSchema,
  postSchema,
  projectSchema,
  seriesSchema,
} from '@/lib/schemas'

import type { Octokit } from '@octokit/rest'
import type { MDXContent } from 'mdx/types'

export type Series = z.infer<typeof seriesSchema>
export type Post = z.infer<typeof postSchema>
export type Author = z.infer<typeof authorSchema>
export type Project = z.infer<typeof projectSchema>

export interface SeriesPostRef {
  slug: string
  title: string
  order: number
}

export interface PostIndex extends Post {
  readingTime: number
  filePath: string
  hasCover: boolean
}

export interface SeriesIndex extends Series {
  posts: SeriesPostRef[]
}

export interface TagCount {
  tag: string
  count: number
}

export interface AdjacentPosts {
  prevPost: PostIndex | null
  nextPost: PostIndex | null
}

export interface PostWithContent {
  Content: MDXContent
  meta: PostIndex
}

export type GithubRepo = Awaited<
  ReturnType<Octokit['repos']['listForUser']>
>['data'][number]
