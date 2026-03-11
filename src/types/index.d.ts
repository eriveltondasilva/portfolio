import { postFrontmatterSchema, seriesSchema } from '@/schemas/blog'

type SeriesMeta = z.infer<typeof seriesSchema>
type PostFrontmatter = z.infer<typeof postFrontmatterSchema>

interface PostIndex extends PostFrontmatter {
  readingTime: number
}

interface SeriesPostRef {
  slug: string
  title: string
  order: number
}

interface SeriesIndex extends SeriesMeta {
  posts: SeriesPostRef[]
}
