import { join, relative } from 'node:path'

import matter from 'gray-matter'
import getReadingTime from 'reading-time'

import { authorSchema, postSchema, seriesSchema } from '@/lib/schemas'
import {
  AUTHORS_FILE,
  COVER_NAME,
  POSTS_DIR,
  POSTS_INDEX_OUTPUT,
  PostStatus,
  SERIES_FILE,
  SERIES_INDEX_OUTPUT,
} from '@/lib/constants'

import {
  writeJson,
  BuildError,
  readJson,
  assertUniqueSlugs,
  errorMessage,
  log,
} from './utils'

import type { PostIndex, Series, SeriesIndex, SeriesPostRef } from '@/types'

type SeriesPost = PostIndex & { series: string; order: number }

function sortByDateDesc<T extends { publishedAt: string }>(items: T[]): T[] {
  return items.toSorted(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  )
}

// ###

function assertUniqueSeriesOrder(posts: PostIndex[]): void {
  const seriesPosts = posts.filter(
    (p): p is SeriesPost => p.series !== undefined && p.order !== undefined,
  )

  const bySeries = Object.groupBy(seriesPosts, ({ series }) => series)

  const conflicts = Object.entries(bySeries).flatMap(([seriesSlug, group]) => {
    const byOrder = Object.groupBy(group!, ({ order }) => order)

    const duplicateOrders = Object.entries(byOrder).filter(
      ([, items]) => (items?.length ?? 0) > 1,
    )

    if (duplicateOrders.length === 0) return []

    const detail = duplicateOrders
      .map(([order, items]) => {
        const files = items!
          .map(({ filePath }) => `\n    - ${filePath}`)
          .join('')
        return `  order ${order}:${files}`
      })
      .join('\n')

    return [`Series "${seriesSlug}" has duplicate "order" values:\n${detail}`]
  })

  if (conflicts.length > 0) {
    throw new BuildError('posts', conflicts)
  }
}

function assertSeriesExist(posts: PostIndex[], knownSeries: Set<string>): void {
  const invalid = posts.filter(
    (p) => p.series !== undefined && !knownSeries.has(p.series),
  )

  if (invalid.length === 0) return

  const detail = invalid
    .map(
      (post) =>
        `  - "${post.slug}" → série "${post.series}"\n    ${post.filePath}`,
    )
    .join('\n')

  const available =
    knownSeries.size > 0 ?
      `\n  Series available: ${[...knownSeries].map((s) => `"${s}"`).join(', ')}`
    : '\n  No series found.'

  throw new BuildError('posts', [
    `Non-existent series referenced:\n${detail}${available}`,
  ])
}

function assertAuthorsExist(
  posts: PostIndex[],
  knownAuthors: Set<string>,
): void {
  const missing = posts.flatMap((post) =>
    post.authors
      .filter((author) => !knownAuthors.has(author))
      .map((author) => ({ author, post })),
  )

  if (missing.length === 0) return

  const detail = missing
    .map(
      ({ author, post }) =>
        `  - author "${author}" in "${post.slug}"\n    ${post.filePath}`,
    )
    .join('\n')

  const available =
    knownAuthors.size > 0 ?
      `\n Authors available: ${[...knownAuthors].map((author) => `"${author}"`).join(', ')}`
    : '\n No authors found.'

  throw new BuildError('posts', [
    `Non-existent authors referenced:\n${detail}${available}`,
  ])
}

// # Readers

async function readAuthors(): Promise<Set<string>> {
  const parsed = await readJson(AUTHORS_FILE)
  const result = authorSchema.array().safeParse(parsed)

  if (!result.success) {
    throw new BuildError('authors', [
      AUTHORS_FILE + '\n',
      ...result.error.issues.map(
        ({ path, message }) => `\t- ${path.join('.')}: ${message}`,
      ),
    ])
  }

  assertUniqueSlugs(
    result.data.map((author) => ({ slug: author.slug, source: AUTHORS_FILE })),
    'authors',
  )

  return new Set(result.data.map((author) => author.slug))
}

async function readSeries(): Promise<Map<string, Series>> {
  const parsed = await readJson(SERIES_FILE)
  const result = seriesSchema.array().safeParse(parsed)

  if (!result.success) {
    throw new BuildError('series', [
      SERIES_FILE + '\n',
      ...result.error.issues.map(
        ({ path, message }) => `\t- ${path.join('.')}: ${message}`,
      ),
    ])
  }

  assertUniqueSlugs(
    result.data.map((series) => ({ slug: series.slug, source: SERIES_FILE })),
    'series',
  )

  return new Map(result.data.map((series) => [series.slug, series]))
}

interface PostsData {
  posts: PostIndex[]
  stats: {
    scanned: number
    published: number
    drafts: number
    withCover: number
  }
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
    .map(({ reason }) => errorMessage(reason))

  if (errors.length > 0) throw new BuildError('posts', errors)

  const publishedResults = results.filter(
    (result): result is PromiseFulfilledResult<PostIndex> =>
      result.status === 'fulfilled' && result.value !== null,
  )

  assertUniqueSlugs(
    publishedResults.map(({ value: post }) => ({
      slug: post.slug,
      source: post.filePath,
    })),
    'posts',
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
  const sorted = sortByDateDesc(posts)
  await writeJson(POSTS_INDEX_OUTPUT, sorted)
}

async function buildSeriesIndex(
  seriesMap: Map<string, Series>,
  posts: PostIndex[],
): Promise<SeriesIndex[]> {
  const postsBySeries = Object.groupBy(
    posts.filter(
      (post): post is SeriesPost =>
        post.series !== undefined && post.order !== undefined,
    ),
    (post) => post.series,
  )

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
  console.info('\n⏳ Generating blog indices...')

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
    .map(({ reason }) => errorMessage(reason))

  if (errors.length > 0) {
    throw new Error(
      `errors during data read.\n\n---\n\n${errors.join('\n\n---\n\n')}\n\n---\n`,
    )
  }

  const authors = (authorsResult as PromiseFulfilledResult<Set<string>>).value
  const seriesMap = (
    seriesResult as PromiseFulfilledResult<Map<string, Series>>
  ).value
  const { posts, stats } = (postsResult as PromiseFulfilledResult<PostsData>)
    .value

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
  log.ok('series references')

  assertUniqueSeriesOrder(posts)
  log.ok('series order')

  assertAuthorsExist(posts, authors)
  log.ok('author references')

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
  log.success(`\n✔ Done in ${elapsed}ms`)
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error)
  log.failure(message)
  process.exit(1)
})
