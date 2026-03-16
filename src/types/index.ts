import { z } from 'zod'

import { authorSchema, postSchema, seriesSchema } from '@/schemas/blog'

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

export enum PostStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

export enum SeriesStatus {
  PLANNED = 'planned',
  IN_PROGRESS = 'in-progress',
  COMPLETE = 'complete',
}
