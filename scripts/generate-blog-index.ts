import { join, relative } from 'node:path'
import { cwd } from 'node:process'
import { readdir, writeFile, readFile } from 'node:fs/promises'
import matter from 'gray-matter'
import readingTime from 'reading-time'

import { postFrontmatterSchema, seriesSchema } from '@/schemas/blog'

import type { SeriesMeta, PostIndex, SeriesIndex, SeriesPostRef } from '@/types'

const CONTENT_DIR = join(cwd(), 'content')
const POSTS_DIR = join(CONTENT_DIR, 'posts')
const SERIES_DIR = join(CONTENT_DIR, 'series')
const OUTPUT_POSTS = join(CONTENT_DIR, 'posts-index.json')
const OUTPUT_SERIES = join(CONTENT_DIR, 'series-index.json')

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function listSubdirectories(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true })
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => join(dir, entry.name))
}

async function writeJson(filePath: string, data: unknown): Promise<void> {
  await writeFile(filePath, JSON.stringify(data, null, 2) + '\n', 'utf-8')
}

interface SlugEntry {
  slug: string
  source: string
}

function assertUniqueSlugs(
  entries: SlugEntry[],
  context: 'posts' | 'series',
): void {
  const seen = new Map<string, string>() 
  const duplicates = new Map<string, string[]>()

  for (const { slug, source } of entries) {
    const first = seen.get(slug)

    if (first !== undefined) {
      const sources = duplicates.get(slug) ?? [first]
      sources.push(source)
      duplicates.set(slug, sources)
    } else {
      seen.set(slug, source)
    }
  }

  if (duplicates.size === 0) return

  const detail = [...duplicates.entries()]
    .map(([slug, sources]) => {
      const files = sources.map((s) => `\n    - ${s}`).join('')
      return `  "${slug}" encontrado em:${files}`
    })
    .join('\n')

  throw new Error(`[${context}] Slugs duplicados encontrados:\n${detail}`)
}

function assertUniqueSeriesOrder(posts: PostIndex[]): void {
  const index = new Map<string, Map<number, string[]>>()

  for (const post of posts) {
    if (!post.series || post.order === undefined) continue

    const byOrder = index.get(post.series) ?? new Map<number, string[]>()
    const sources = byOrder.get(post.order) ?? []
    sources.push(post.filePath)
    byOrder.set(post.order, sources)
    index.set(post.series, byOrder)
  }

  for (const [seriesSlug, byOrder] of index) {
    const conflicts = [...byOrder.entries()].filter(
      ([, sources]) => sources.length > 1,
    )
    if (conflicts.length === 0) continue

    const detail = conflicts
      .map(([order, sources]) => {
        const files = sources.map((s) => `\n    - ${s}`).join('')
        return `  order ${order}:${files}`
      })
      .join('\n')

    throw new Error(
      `[posts] Série "${seriesSlug}" possui posts com "order" duplicado:\n${detail}`,
    )
  }
}

function collectErrors(
  results: PromiseSettledResult<unknown>[],
  context: 'posts' | 'series',
): void {
  const errors = results
    .filter((r): r is PromiseRejectedResult => r.status === 'rejected')
    .map((r) =>
      r.reason instanceof Error ? r.reason.message : String(r.reason),
    )

  if (errors.length > 0) {
    throw new Error(
      `[${context}] ${errors.length} erro(s) encontrado(s):\n\n${errors.join('\n\n')}`,
    )
  }
}

// ---------------------------------------------------------------------------
// Readers
// ---------------------------------------------------------------------------

async function readSeries(): Promise<Map<string, SeriesMeta>> {
  const dirs = await listSubdirectories(SERIES_DIR)

  const results = await Promise.allSettled(
    dirs.map(async (dir) => {
      const filePath = join(dir, 'index.json')

      let raw: string
      try {
        raw = await readFile(filePath, 'utf-8')
      } catch {
        throw new Error(`[series] Arquivo não encontrado: ${filePath}`)
      }

      let parsed: unknown
      try {
        parsed = JSON.parse(raw)
      } catch {
        throw new Error(`[series] JSON inválido em: ${filePath}`)
      }

      const result = seriesSchema.safeParse(parsed)
      if (!result.success) {
        const issues = result.error.issues
          .map((i) => `  - ${i.path.join('.')}: ${i.message}`)
          .join('\n')
        throw new Error(`[series] Validação falhou em ${filePath}:\n${issues}`)
      }

      return { data: result.data, filePath }
    }),
  )

  collectErrors(results, 'series')

  const entries = results
    .filter(
      (
        r,
      ): r is PromiseFulfilledResult<{ data: SeriesMeta; filePath: string }> =>
        r.status === 'fulfilled',
    )
    .map((r) => r.value)

  assertUniqueSlugs(
    entries.map(({ data, filePath }) => ({
      slug: data.slug,
      source: filePath,
    })),
    'series',
  )

  return new Map(entries.map(({ data }) => [data.slug, data]))
}

async function readPosts(): Promise<PostIndex[]> {
  const dirs = await listSubdirectories(POSTS_DIR)

  const results = await Promise.allSettled(
    dirs.map(async (dir): Promise<PostIndex | null> => {
      const filePath = join(dir, 'index.mdx')

      let raw: string
      try {
        raw = await readFile(filePath, 'utf-8')
      } catch {
        throw new Error(`[posts] Arquivo não encontrado: ${filePath}`)
      }

      const { data: frontmatter, content } = matter(raw)

      const result = postFrontmatterSchema.safeParse(frontmatter)
      if (!result.success) {
        const issues = result.error.issues
          .map((i) => `  - ${i.path.join('.')}: ${i.message}`)
          .join('\n')
        throw new Error(`[posts] Validação falhou em ${filePath}:\n${issues}`)
      }

      const post = result.data

      if (!post.published) return null

      return {
        ...post,
        readingTime: Math.ceil(readingTime(content).minutes),
        filePath,
      }
    }),
  )

  collectErrors(results, 'posts')

  const publishedPosts = results
    .filter(
      (r): r is PromiseFulfilledResult<PostIndex | null> =>
        r.status === 'fulfilled',
    )
    .map((r) => r.value)
    .filter((post): post is PostIndex => post !== null)

  assertUniqueSlugs(
    publishedPosts.map((p) => ({ slug: p.slug, source: p.filePath })),
    'posts',
  )
  assertUniqueSeriesOrder(publishedPosts)

  return publishedPosts.map((post) => ({
    ...post,
    filePath: relative(cwd(), post.filePath),
  }))
}

function assertSeriesExist(posts: PostIndex[], knownSeries: Set<string>): void {
  const invalid = posts.filter(
    (p) => p.series !== undefined && !knownSeries.has(p.series),
  )

  if (invalid.length === 0) return

  const detail = invalid
    .map(
      (p) =>
        `  - "${p.slug}" referencia a série "${p.series}"\n    Arquivo: ${p.filePath}`,
    )
    .join('\n')

  throw new Error(`[posts] Séries inexistentes referenciadas:\n${detail}`)
}

// ---------------------------------------------------------------------------
// Index builders
// ---------------------------------------------------------------------------

async function buildPostsIndex(posts: PostIndex[]): Promise<void> {
  const sorted = [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )

  await writeJson(OUTPUT_POSTS, sorted)
  console.log(`✔ posts-index.json → ${sorted.length} post(s)`)
}

async function buildSeriesIndex(
  seriesMap: Map<string, SeriesMeta>,
  posts: PostIndex[],
): Promise<void> {
  const seriesWithPosts: SeriesIndex[] = Array.from(seriesMap.values())
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map((series) => {
      const relatedPosts: SeriesPostRef[] = posts
        .filter(
          (p): p is PostIndex & { order: number } => p.series === series.slug,
        )
        .sort((a, b) => a.order - b.order)
        .map((p) => ({
          slug: p.slug,
          title: p.title,
          order: p.order,
        }))

      return { ...series, posts: relatedPosts }
    })

  await writeJson(OUTPUT_SERIES, seriesWithPosts)
  console.log(`✔ series-index.json → ${seriesWithPosts.length} série(s)`)
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  console.log('> Gerando índices do blog...\n')

  const [seriesResult, postsResult] = await Promise.allSettled([
    readSeries(),
    readPosts(),
  ])

  const errors = [seriesResult, postsResult]
    .filter((r): r is PromiseRejectedResult => r.status === 'rejected')
    .map((r) =>
      r.reason instanceof Error ? r.reason.message : String(r.reason),
    )

  if (errors.length > 0) {
    throw new Error(errors.join('\n\n'))
  }

  const seriesMap = (
    seriesResult as PromiseFulfilledResult<Map<string, SeriesMeta>>
  ).value
  const posts = (postsResult as PromiseFulfilledResult<PostIndex[]>).value

  assertSeriesExist(posts, new Set(seriesMap.keys()))

  await Promise.all([
    buildPostsIndex(posts),
    buildSeriesIndex(seriesMap, posts),
  ])

  console.log('\n> Índices gerados com sucesso.')
}

main().catch((err: unknown) => {
  console.error('> Erro ao gerar índices:')
  console.error(err instanceof Error ? err.message : err)
  process.exit(1)
})
