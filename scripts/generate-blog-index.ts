import { join, relative } from 'node:path'

import matter from 'gray-matter'
import getReadingTime from 'reading-time'

import { authorSchema, postSchema, seriesSchema } from '@/lib/schemas'
import {
  AUTHORS_SOURCE_FILE,
  COVER_NAME,
  POSTS_DIR,
  POSTS_INDEX_OUTPUT,
  PostStatus,
  SERIES_SOURCE_FILE,
  SERIES_INDEX_OUTPUT,
} from '@/lib/constants'

import { writeJson, BuildError, readJson, getErrMessage, Logger, sortByDateDesc } from './utils'
import {
  assertAuthorsExist,
  assertSeriesExist,
  assertUniqueSeriesOrder,
  assertUniqueSlugs,
} from './validations'

import type { PostIndex, Series, SeriesIndex, SeriesPostRef } from '@/types'

type SeriesPost = PostIndex & { series: string; order: number }

interface PostsData {
  posts: PostIndex[]
  stats: {
    scanned: number
    published: number
    archived: number
    drafts: number
    withCover: number
  }
}

const log = new Logger()

// # Readers

async function readAuthors(): Promise<Set<string>> {
  const data = await readJson(AUTHORS_SOURCE_FILE)
  const result = authorSchema.array().safeParse(data)

  if (!result.success) {
    const issues = result.error.issues
      .map(({ path, message }) => `  - ${path.join('.')}: ${message}`)
      .join('\n')
    const errorMessage = `${AUTHORS_SOURCE_FILE}\n\n${issues}`

    throw new BuildError('authors', [errorMessage])
  }

  assertUniqueSlugs(
    'authors',
    result.data.map((author) => ({
      slug: author.slug,
      source: AUTHORS_SOURCE_FILE,
    })),
  )

  return new Set(result.data.map((author) => author.slug))
}

async function readSeries(): Promise<Map<string, Series>> {
  const data = await readJson(SERIES_SOURCE_FILE)
  const result = seriesSchema.array().safeParse(data)

  if (!result.success) {
    const issues = result.error.issues
      .map(({ path, message }) => `  - ${path.join('.')}: ${message}`)
      .join('\n')
    const errorMessage = `${SERIES_SOURCE_FILE}\n\n${issues}`

    throw new BuildError('series', [errorMessage])
  }

  assertUniqueSlugs(
    'series',
    result.data.map((series) => ({
      slug: series.slug,
      source: SERIES_SOURCE_FILE,
    })),
  )

  return new Map(result.data.map((series) => [series.slug, series]))
}

async function readPosts(): Promise<PostsData> {
  const glob = new Bun.Glob('*/index.mdx')
  const files = Array.from(glob.scanSync({ cwd: POSTS_DIR, absolute: true }))

  const results = await Promise.allSettled(
    files.map(async (file) => {
      const raw = await Bun.file(file).text()
      const { data: frontmatter, content } = matter(raw)

      const { success, data, error } = postSchema.safeParse(frontmatter)

      if (!success) {
        const issues = error.issues
          .map(({ path, message }) => `  - ${path.join('.')}: ${message}`)
          .join('\n')
        const errorMessage = `${file}\n\n${issues}\n`

        throw new Error(errorMessage)
      }

      if (data.status === PostStatus.DRAFT) return null

      const hasCover = await Bun.file(join(file, '..', COVER_NAME)).exists()
      const readingTime = Math.ceil(getReadingTime(content).minutes)
      const filePath = relative(process.cwd(), file).replaceAll('\\', '/')

      return {
        ...data,
        hasCover,
        readingTime,
        filePath,
      } satisfies PostIndex
    }),
  )

  const errors = results
    .filter((result): result is PromiseRejectedResult => result.status === 'rejected')
    .map(({ reason }) => getErrMessage(reason))

  if (errors.length > 0) throw new BuildError('posts', errors)

  const fulfilledResults = results.filter(
    (result): result is PromiseFulfilledResult<PostIndex> =>
      result.status === 'fulfilled' && result.value !== null,
  )

  assertUniqueSlugs(
    'posts',
    fulfilledResults.map(({ value: post }) => ({
      slug: post.slug,
      source: post.filePath,
    })),
  )

  const posts = fulfilledResults.map(({ value }) => value)

  const publishedCount = posts.filter((p) => p.status === PostStatus.PUBLISHED).length
  const archivedCount = posts.filter((p) => p.status === PostStatus.ARCHIVED).length

  return {
    posts,
    stats: {
      scanned: files.length,
      published: publishedCount,
      archived: archivedCount,
      drafts: files.length - fulfilledResults.length,
      withCover: posts.filter((post) => post.hasCover && post.status === PostStatus.PUBLISHED)
        .length,
    },
  }
}

// # Builders

async function buildPostsIndex(posts: PostIndex[]): Promise<void> {
  const sortedPosts = sortByDateDesc(posts)
  await writeJson(POSTS_INDEX_OUTPUT, sortedPosts)
}

async function buildSeriesIndex(
  seriesMap: Map<string, Series>,
  posts: PostIndex[],
): Promise<SeriesIndex[]> {
  const filteredPosts = posts.filter(
    (post): post is SeriesPost => post.series !== undefined && post.order !== undefined,
  )
  const postsBySeries = Object.groupBy(filteredPosts, (post) => post.series)

  const seriesWithPosts: SeriesIndex[] = sortByDateDesc(Array.from(seriesMap.values())).map(
    (series) => {
      const relatedPosts: SeriesPostRef[] = (postsBySeries[series.slug] ?? [])
        .toSorted((a, b) => a.order - b.order)
        .map(({ slug, title, order }) => ({ slug, title, order }))

      return { ...series, posts: relatedPosts }
    },
  )

  await writeJson(SERIES_INDEX_OUTPUT, seriesWithPosts)

  return seriesWithPosts
}

// # Main

async function main(): Promise<void> {
  const startedAt = performance.now()

  log.divider()
  console.info('⏳ Generating blog indices...')

  // ---------------------------------------------------------------------------

  log.section('Reading content')

  const [authors, series, postsData] = await Promise.all([readAuthors(), readSeries(), readPosts()])

  const { posts, stats } = postsData
  log.ok('authors:', `${authors.size} loaded`)
  log.ok('series:', `${series.size} loaded`)
  log.ok('posts:', `${stats.published} published of ${stats.scanned} scanned`)

  if (stats.archived > 0) log.skip('archived:', `${stats.archived} archived`)
  if (stats.drafts > 0) log.skip('drafts:', `${stats.drafts} skipped`)
  if (stats.withCover < stats.published) {
    log.skip(
      'cover:',
      `${stats.published - stats.withCover} of ${stats.published} published post(s) without cover`,
    )
  }

  // ---------------------------------------------------------------------------

  log.section('Validating')

  assertSeriesExist(posts, new Set(series.keys()))
  assertUniqueSeriesOrder(posts)
  assertAuthorsExist(posts, authors)

  if (series.size > 0) log.ok('series exist:', 'all referenced series are defined')
  if (series.size > 0) log.ok('series order:', 'all posts have unique order')
  if (authors.size > 0) log.ok('authors exist:', 'all referenced authors are defined')

  const seriesPosts = posts.filter((post) => post.series !== undefined)

  if (seriesPosts.length > 0) {
    log.detail(`${seriesPosts.length} of ${stats.published} post(s) linked to series`)
  }

  // ---------------------------------------------------------------------------

  log.section('Writing indices')

  const [seriesWithPosts] = await Promise.all([
    buildSeriesIndex(series, posts),
    buildPostsIndex(posts),
  ])

  log.ok('posts index:', POSTS_INDEX_OUTPUT)
  log.ok('series index:', SERIES_INDEX_OUTPUT)

  for (const seriesData of seriesWithPosts) {
    if (seriesData.posts.length === 0) return
    log.detail(`${seriesData.slug}  (${seriesData.posts.length} posts)`)
  }

  // ---------------------------------------------------------------------------

  log.success(`✅ Done in ${(performance.now() - startedAt).toFixed(0)}ms`)
  log.divider()
}

main().catch((error) => {
  log.failure(error)
  process.exit(1)
})
