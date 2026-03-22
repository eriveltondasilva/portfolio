import { join, relative } from 'node:path'

import matter from 'gray-matter'
import readingTime from 'reading-time'

import { logSuccess, writeJson } from '@/lib'
import { authorSchema, postSchema, seriesSchema } from '@/lib/schemas'
import { PostStatus } from '@/lib/constants'

import type { PostIndex, Series, SeriesIndex, SeriesPostRef } from '@/types'

const ROOT = join(import.meta.dir, '..')
const CONTENT_DIR = join(ROOT, 'content')
const POSTS_DIR = join(CONTENT_DIR, 'posts')
const SERIES_DIR = join(CONTENT_DIR, 'series')
const AUTHORS_FILE = join(CONTENT_DIR, 'authors', 'index.json')
const OUTPUT_POSTS = join(CONTENT_DIR, 'posts-index.json')
const OUTPUT_SERIES = join(CONTENT_DIR, 'series-index.json')

type BuildContext = 'authors' | 'series' | 'posts'
type SeriesPost = PostIndex & { series: string; order: number }

// ###

function sortByDateDesc<T extends { publishedAt: string }>(items: T[]): T[] {
  return items.toSorted(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  )
}

function errorMessage(reason: unknown): string {
  return reason instanceof Error ? reason.message : String(reason)
}

function unwrapFulfilled<T>(result: PromiseSettledResult<T>): T {
  if (result.status !== 'fulfilled') {
    throw new Error('Expected a fulfilled result, got rejected.')
  }
  return result.value
}

// ###

class BuildError extends Error {
  constructor(
    readonly context: BuildContext,
    messages: string[],
  ) {
    super(
      `[${context}] ${messages.length} error(s) found:\n\n${messages.join('\n')}`,
    )
    this.name = 'BuildError'
  }
}

// ###

async function readJson(filePath: string): Promise<unknown> {
  try {
    return await Bun.file(filePath).json()
  } catch (cause) {
    throw new Error(`Failed to read file: ${filePath}`, { cause })
  }
}

// ###

function assertUniqueSlugs(
  entries: { slug: string; source: string }[],
  context: BuildContext,
): void {
  const grouped = Object.groupBy(entries, ({ slug }) => slug)

  const duplicates = Object.entries(grouped).filter(
    ([, group]) => (group?.length ?? 0) > 1,
  )

  if (duplicates.length === 0) return

  const detail = duplicates
    .map(([slug, group]) => {
      const files = (group ?? [])
        .map(({ source }) => `\n    - ${source}`)
        .join('')
      return `  "${slug}" found in:${files}`
    })
    .join('\n')

  throw new BuildError(context, [`Duplicate slugs found:\n${detail}`])
}

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

// ###

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
  const filePath = join(SERIES_DIR, 'index.json')
  const parsed = await readJson(filePath)

  const result = seriesSchema.array().safeParse(parsed)
  if (!result.success) {
    throw new BuildError('series', [
      filePath + '\n',
      ...result.error.issues.map(
        ({ path, message }) => `\t- ${path.join('.')}: ${message}`,
      ),
    ])
  }

  assertUniqueSlugs(
    result.data.map((series) => ({ slug: series.slug, source: filePath })),
    'series',
  )

  return new Map(result.data.map((series) => [series.slug, series]))
}

async function readPosts(): Promise<PostIndex[]> {
  const glob = new Bun.Glob('*/index.mdx')
  const files = [...glob.scanSync({ cwd: POSTS_DIR, absolute: true })]

  const results = await Promise.allSettled(
    files.map(async (filePath) => {
      const raw = await Bun.file(filePath).text()
      const { data: frontmatter, content } = matter(raw)

      const { success, data, error } = postSchema.safeParse(frontmatter)
      if (!success) {
        const issues = error.issues
          .map(({ path, message }) => `\t- ${path.join('.')}: ${message}`)
          .join('\n')
        throw new Error(`${filePath}\n\n${issues}`)
      }

      if (data.status === PostStatus.DRAFT) return null

      return {
        ...data,
        readingTime: Math.ceil(readingTime(content).minutes),
        filePath: relative(ROOT, filePath).replaceAll('\\', '/'),
      } satisfies PostIndex
    }),
  )

  const errors = results
    .filter(
      (result): result is PromiseRejectedResult => result.status === 'rejected',
    )
    .map(({ reason }) => errorMessage(reason))

  if (errors.length > 0) throw new BuildError('posts', errors)

  const publishedPosts = results.filter(
    (result): result is PromiseFulfilledResult<PostIndex> =>
      result.status === 'fulfilled' && result.value !== null,
  )

  assertUniqueSlugs(
    publishedPosts.map(({ value: post }) => ({
      slug: post.slug,
      source: post.filePath,
    })),
    'posts',
  )

  return publishedPosts.map(({ value }) => value)
}

// ###

async function buildPostsIndex(posts: PostIndex[]): Promise<void> {
  const sorted = sortByDateDesc(posts)
  await writeJson(OUTPUT_POSTS, sorted)
  console.info(`> posts-index.json → ${sorted.length} post(s)`)
}

async function buildSeriesIndex(
  seriesMap: Map<string, Series>,
  posts: PostIndex[],
): Promise<void> {
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

  await writeJson(OUTPUT_SERIES, seriesWithPosts)
  console.info(`> series-index.json → ${seriesWithPosts.length} series`)
}

// ---------------------------------------------------------------------------
// # Entry point
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  console.info('⏳ Generating blog indices...\n')

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

  const authors = unwrapFulfilled(authorsResult)
  const seriesMap = unwrapFulfilled(seriesResult)
  const posts = unwrapFulfilled(postsResult)

  assertSeriesExist(posts, new Set(seriesMap.keys()))
  assertUniqueSeriesOrder(posts)
  assertAuthorsExist(posts, authors)

  await Promise.all([
    buildPostsIndex(posts),
    buildSeriesIndex(seriesMap, posts),
  ])

  logSuccess('\n✔ Indices generated successfully.')
}

main().catch((error: unknown) => {
  console.error('❌ Error generating indices:')
  console.error(error instanceof Error ? error.message : error)
  console.error('> Fix the errors above and try again.\n')
  process.exit(1)
})
