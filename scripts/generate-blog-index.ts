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

import {
  writeJson,
  BuildError,
  readJson,
  getErrMessage,
  Logger,
  sortByDateDesc,
} from './utils'
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
    const errorMessages = [
      AUTHORS_SOURCE_FILE + '\n',
      ...result.error.issues.map(
        ({ path, message }) => `    - ${path.join('.')}: ${message}`,
      ),
    ]

    throw new BuildError('authors', errorMessages)
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
    const errorMessages = [
      SERIES_SOURCE_FILE + '\n',
      ...result.error.issues.map(
        ({ path, message }) => `\t- ${path.join('.')}: ${message}`,
      ),
    ]

    throw new BuildError('series', errorMessages)
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
          .map(({ path, message }) => `\t- ${path.join('.')}: ${message}`)
          .join('\n')

        throw new Error(`${file}\n\n${issues}`)
      }

      if (data.status !== PostStatus.PUBLISHED) return null

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
    .filter(
      (result): result is PromiseRejectedResult => result.status === 'rejected',
    )
    .map(({ reason }) => getErrMessage(reason))

  if (errors.length > 0) throw new BuildError('posts', errors)

  const publishedResults = results.filter(
    (result): result is PromiseFulfilledResult<PostIndex> =>
      result.status === 'fulfilled' && result.value !== null,
  )

  assertUniqueSlugs(
    'posts',
    publishedResults.map(({ value: post }) => ({
      slug: post.slug,
      source: post.filePath,
    })),
  )

  const posts = publishedResults.map(({ value }) => value)

  return {
    posts,
    stats: {
      scanned: files.length,
      published: posts.length,
      drafts: files.length - publishedResults.length,
      withCover: posts.filter((post) => post.hasCover).length,
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
    (post): post is SeriesPost =>
      post.series !== undefined && post.order !== undefined,
  )
  const postsBySeries = Object.groupBy(filteredPosts, (post) => post.series)

  const seriesWithPosts: SeriesIndex[] = sortByDateDesc(
    Array.from(seriesMap.values()),
  ).map((series) => {
    const relatedPosts: SeriesPostRef[] = (postsBySeries[series.slug] ?? [])
      .toSorted((a, b) => a.order - b.order)
      .map(({ slug, title, order }) => ({ slug, title, order }))

    return { ...series, posts: relatedPosts }
  })

  await writeJson(SERIES_INDEX_OUTPUT, seriesWithPosts)

  return seriesWithPosts
}

// # Main

async function main(): Promise<void> {
  const startedAt = performance.now()

  log.divider()
  console.info('⏳ Generating blog indices...')

  // -- Read -------------------------------------------------------------------

  log.section('Reading content:')

  const [authorsResult, seriesResult, postsResult] = await Promise.allSettled([
    readAuthors(),
    readSeries(),
    readPosts(),
  ])

  const errors = [authorsResult, seriesResult, postsResult]
    .filter(
      (result): result is PromiseRejectedResult => result.status === 'rejected',
    )
    .map(({ reason }) => getErrMessage(reason))

  if (errors.length > 0) {
    const errorMessage = `# Errors during data read.\n\n---\n\n${errors.join('\n\n---\n\n')}\n\n---\n`
    throw new Error(errorMessage)
  }

  const getValue = <T>(result: PromiseSettledResult<T>) => {
    if (result.status === 'rejected') throw result.reason
    return result.value
  }

  const authors = getValue(authorsResult)
  const seriesMap = getValue(seriesResult)
  const { posts, stats } = getValue(postsResult)

  log.ok('authors', `${authors.size} loaded`)
  log.ok('series', `${seriesMap.size} loaded`)
  log.ok(
    'posts',
    `${stats.published} published · ${stats.withCover} with cover`,
  )

  if (stats.drafts > 0) {
    log.skip('drafts', `${stats.drafts} skipped`)
  }

  // -- Validate ---------------------------------------------------------------

  log.section('Validating:')

  assertSeriesExist(posts, new Set(seriesMap.keys()))
  assertUniqueSeriesOrder(posts)
  assertAuthorsExist(posts, authors)

  log.ok('series exist', `${seriesMap.size} known`)
  log.ok('unique order', 'no conflicts')
  log.ok('authors exist', `${authors.size} known`)

  const seriesPosts = posts.filter((post) => post.series !== undefined)

  if (seriesPosts.length > 0) {
    log.detail(`${seriesPosts.length} post(s) assigned to series`)
  }

  // -- Write ------------------------------------------------------------------

  log.section('Writing indexes:')

  const [seriesWithPosts] = await Promise.all([
    buildSeriesIndex(seriesMap, posts),
    buildPostsIndex(posts),
  ])

  log.ok(POSTS_INDEX_OUTPUT, `${stats.published} post(s)`)
  log.ok(SERIES_INDEX_OUTPUT, `${seriesWithPosts.length} series`)

  for (const series of seriesWithPosts) {
    if (series.posts.length > 0) {
      log.detail(`${series.slug}  (${series.posts.length} posts)`)
    }
  }

  // -- Done -------------------------------------------------------------------

  const elapsed = (performance.now() - startedAt).toFixed(0)
  log.success(`✅ Done in ${elapsed}ms`)
}

main().catch((error) => {
  log.failure(error)
  process.exit(1)
})
