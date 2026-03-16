import { join, relative } from 'node:path'
import { styleText } from 'node:util'

import matter from 'gray-matter'
import readingTime from 'reading-time'
import { $ZodIssue } from 'zod/v4/core'

import { postSchema, seriesSchema } from '@/schemas/blog'
import { PostStatus } from '@/types'

import type { PostIndex, Series, SeriesIndex, SeriesPostRef } from '@/types'

// ---------------------------------------------------------------------------
// # Constants
// ---------------------------------------------------------------------------

const ROOT = join(import.meta.dir, '..')
const CONTENT_DIR = join(ROOT, 'content')
const POSTS_DIR = join(CONTENT_DIR, 'posts')
const SERIES_DIR = join(CONTENT_DIR, 'series')
const OUTPUT_POSTS = join(CONTENT_DIR, 'posts-index.json')
const OUTPUT_SERIES = join(CONTENT_DIR, 'series-index.json')

const successMsg = (text: string) => console.info(styleText('green', text))

// ---------------------------------------------------------------------------
// # Error
// ---------------------------------------------------------------------------

class BuildError extends Error {
  constructor(
    readonly context: 'posts' | 'series',
    messages: string[],
  ) {
    super(
      `[${context}] ${messages.length} erro(s) encontrado(s):\n\n${messages.join('\n\n')}`,
    )
    this.name = 'BuildError'
  }
}

// ---------------------------------------------------------------------------
// # Bun-native I/O
// ---------------------------------------------------------------------------

async function readJson(filePath: string): Promise<unknown> {
  try {
    return await Bun.file(filePath).json()
  } catch (cause) {
    throw new Error(`Não foi possível ler ou parsear: ${filePath}`, { cause })
  }
}

async function readText(filePath: string): Promise<string> {
  try {
    return await Bun.file(filePath).text()
  } catch (cause) {
    throw new Error(`Não foi possível ler: ${filePath}`, { cause })
  }
}

async function writeJson(filePath: string, data: unknown): Promise<void> {
  await Bun.write(filePath, JSON.stringify(data, null, 2))
}

// ---------------------------------------------------------------------------
// # Bun-native Glob
// ---------------------------------------------------------------------------

async function globFiles(pattern: string, cwd: string): Promise<string[]> {
  const glob = new Bun.Glob(pattern)
  const files: string[] = []

  for await (const file of glob.scan({ cwd, absolute: true })) {
    files.push(file)
  }

  return files
}

// ---------------------------------------------------------------------------
// # Helpers
// ---------------------------------------------------------------------------

function formatZodIssues(issues: $ZodIssue[]): string {
  return issues
    .map(({ path, message }) => `  - ${path.join('.')}: ${message}`)
    .join('\n')
}

function errorMessage(reason: unknown): string {
  return reason instanceof Error ? reason.message : String(reason)
}

function collectSettledErrors(
  results: PromiseSettledResult<unknown>[],
  context: 'posts' | 'series',
): void {
  const errors = results
    .filter((r): r is PromiseRejectedResult => r.status === 'rejected')
    .map(({ reason }) => errorMessage(reason))

  if (errors.length > 0) throw new BuildError(context, errors)
}

function fulfilledValues<T>(results: PromiseFulfilledResult<T>[]): T[] {
  return results.map(({ value }) => value)
}

// ---------------------------------------------------------------------------
// # Assertions
// ---------------------------------------------------------------------------

function assertUniqueSlugs(
  entries: { slug: string; source: string }[],
  context: 'posts' | 'series',
): void {
  const grouped = Object.groupBy(entries, ({ slug }) => slug)

  const duplicates = Object.entries(grouped).filter(
    ([, group]) => (group?.length ?? 0) > 1,
  )

  if (duplicates.length === 0) return

  const detail = duplicates
    .map(([slug, group]) => {
      const files = group!.map(({ source }) => `\n    - ${source}`).join('')
      return `  "${slug}" encontrado em:${files}`
    })
    .join('\n')

  throw new BuildError(context, [
    `${duplicates.length} slug(s) duplicado(s) encontrado(s):\n${detail}`,
  ])
}

function assertUniqueSeriesOrder(posts: PostIndex[]): void {
  type SeriesPost = PostIndex & { series: string; order: number }

  const seriesPosts = posts.filter(
    (p): p is SeriesPost => p.series !== undefined && p.order !== undefined,
  )

  const bySeries = Object.groupBy(seriesPosts, ({ series }) => series)

  const conflicts = Object.entries(bySeries).flatMap(([seriesSlug, group]) => {
    const byOrder = Object.groupBy(group!, ({ order }) => order)

    const duplicateOrders = Object.entries(byOrder).filter(
      ([, posts]) => (posts?.length ?? 0) > 1,
    )

    if (duplicateOrders.length === 0) return []

    const detail = duplicateOrders
      .map(([order, posts]) => {
        const files = posts!
          .map(({ filePath }) => `\n    - ${filePath}`)
          .join('')
        return `  order ${order}:${files}`
      })
      .join('\n')

    return [`Série "${seriesSlug}" tem "order" duplicado:\n${detail}`]
  })

  if (conflicts.length > 0) throw new BuildError('posts', conflicts)
}

function assertSeriesExist(posts: PostIndex[], knownSeries: Set<string>): void {
  const invalid = posts.filter(
    (p) => p.series !== undefined && !knownSeries.has(p.series),
  )

  if (invalid.length === 0) return

  const detail = invalid
    .map((p) => `  - "${p.slug}" → série "${p.series}"\n    ${p.filePath}`)
    .join('\n')

  const available =
    knownSeries.size > 0 ?
      `\n  Séries disponíveis: ${[...knownSeries].map((s) => `"${s}"`).join(', ')}`
    : '\n  Nenhuma série encontrada.'

  throw new BuildError('posts', [
    `Séries inexistentes referenciadas:\n${detail}${available}`,
  ])
}

// ---------------------------------------------------------------------------
// # Readers
// ---------------------------------------------------------------------------
// scripts/generate-blog-index.ts

async function readSeries(): Promise<Map<string, Series>> {
  const filePath = join(SERIES_DIR, 'index.json')
  const parsed = await readJson(filePath)

  const result = seriesSchema.array().safeParse(parsed)
  if (!result.success) {
    throw new BuildError(
      'series',
      result.error.issues.map(
        ({ path, message }) => `  - ${path.join('.')}: ${message}`,
      ),
    )
  }

  assertUniqueSlugs(
    result.data.map((s) => ({ slug: s.slug, source: filePath })),
    'series',
  )

  return new Map(result.data.map((s) => [s.slug, s]))
}

async function readPosts(): Promise<PostIndex[]> {
  const files = await globFiles('*/index.mdx', POSTS_DIR)

  const results = await Promise.allSettled(
    files.map(async (filePath): Promise<PostIndex | null> => {
      const raw = await readText(filePath)
      const { data: frontmatter, content } = matter(raw)

      const { success, data, error } = postSchema.safeParse(frontmatter)
      if (!success) {
        throw new Error(
          `Validação falhou em ${filePath}:\n${formatZodIssues(error.issues)}`,
        )
      }

      if (data.status !== PostStatus.PUBLISHED) return null

      return {
        ...data,
        readingTime: Math.ceil(readingTime(content).minutes),
        filePath,
      }
    }),
  )

  collectSettledErrors(results, 'posts')

  const publishedPosts = fulfilledValues(
    results as PromiseFulfilledResult<PostIndex | null>[],
  ).filter((p): p is PostIndex => p !== null)

  assertUniqueSlugs(
    publishedPosts.map((p) => ({ slug: p.slug, source: p.filePath })),
    'posts',
  )
  assertUniqueSeriesOrder(publishedPosts)

  return publishedPosts.map((post) => ({
    ...post,
    filePath: relative(ROOT, post.filePath).replaceAll('\\', '/'),
  }))
}

// ---------------------------------------------------------------------------
// # Index builders
// ---------------------------------------------------------------------------

async function buildPostsIndex(posts: PostIndex[]): Promise<void> {
  const sorted = posts.toSorted(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  )

  await writeJson(OUTPUT_POSTS, sorted)
  console.info(successMsg(`✔ posts-index.json → ${sorted.length} post(s)`))
}

async function buildSeriesIndex(
  seriesMap: Map<string, Series>,
  posts: PostIndex[],
): Promise<void> {
  type SeriesPost = PostIndex & { series: string; order: number }

  const postsBySeries = Object.groupBy(
    posts.filter(
      (p): p is SeriesPost => p.series !== undefined && p.order !== undefined,
    ),
    ({ series }) => series,
  )

  const seriesWithPosts: SeriesIndex[] = Array.from(seriesMap.values())
    .toSorted(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    )
    .map((series) => {
      const relatedPosts: SeriesPostRef[] = (postsBySeries[series.slug] ?? [])
        .toSorted((a, b) => a.order - b.order)
        .map(({ slug, title, order }) => ({ slug, title, order }))

      return { ...series, posts: relatedPosts }
    })

  await writeJson(OUTPUT_SERIES, seriesWithPosts)
  console.info(
    successMsg(`✔ series-index.json → ${seriesWithPosts.length} série(s)`),
  )
}

// ---------------------------------------------------------------------------
// # Entry point
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  console.info('\n> Gerando índices do blog...\n')

  const [seriesResult, postsResult] = await Promise.allSettled([
    readSeries(),
    readPosts(),
  ])

  const errors = [seriesResult, postsResult]
    .filter((r): r is PromiseRejectedResult => r.status === 'rejected')
    .map(({ reason }) => errorMessage(reason))

  if (errors.length > 0) {
    throw new Error(
      `${errors.length} contexto(s) com erro durante a geração dos índices:\n\n---\n\n${errors.join('\n\n---\n\n')}`,
    )
  }

  const seriesMap = (
    seriesResult as PromiseFulfilledResult<Map<string, Series>>
  ).value
  const posts = (postsResult as PromiseFulfilledResult<PostIndex[]>).value

  assertSeriesExist(posts, new Set(seriesMap.keys()))

  await Promise.all([
    buildPostsIndex(posts),
    buildSeriesIndex(seriesMap, posts),
  ])

  console.info('\n> Índices gerados com sucesso.')
}

main().catch((error: unknown) => {
  console.error('❌ Erro ao gerar índices:')
  console.error(error instanceof Error ? error.message : error)
  console.error('\n> Corrija os erros acima e tente novamente.\n')
  process.exit(1)
})
