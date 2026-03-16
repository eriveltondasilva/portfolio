import { z } from 'zod'

import {
  authorSchema,
  postFrontmatterSchema,
  seriesSchema,
} from '@/schemas/blog'

export type SeriesMeta = z.infer<typeof seriesSchema>
export type PostFrontmatter = z.infer<typeof postFrontmatterSchema>
export type Author = z.infer<typeof authorSchema>

export interface PostIndex extends PostFrontmatter {
  readingTime: number
  filePath: string
}

export interface SeriesPostRef {
  slug: string
  title: string
  order: number
}

export interface SeriesIndex extends SeriesMeta {
  posts: SeriesPostRef[]
}
