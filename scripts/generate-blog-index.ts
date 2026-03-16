import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join, relative } from 'node:path'
import { cwd } from 'node:process'

import matter from 'gray-matter'
import readingTime from 'reading-time'

import { postSchema, seriesSchema } from '@/schemas/blog'

import type { PostIndex, Series, SeriesIndex, SeriesPostRef } from '@/types'

interface SlugEntry {
  slug: string
  source: string
}

const CONTENT_DIR = join(cwd(), 'content')
const POSTS_DIR = join(CONTENT_DIR, 'posts')
const SERIES_DIR = join(CONTENT_DIR, 'series')
const OUTPUT_POSTS = join(CONTENT_DIR, 'posts-index.json')
const OUTPUT_SERIES = join(CONTENT_DIR, 'series-index.json')

// ---------------------------------------------------------------------------
// # Helpers
// ---------------------------------------------------------------------------

function unwrap<T>(result: PromiseSettledResult<T>): T {
  if (result.status === 'rejected') throw result.reason
  return result.value
}

async function listSubdirectories(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true })
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => join(dir, entry.name))
}

async function writeJson(filePath: string, data: unknown): Promise<void> {
  await writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8')
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

  throw new Error(
    `[${context}] ${duplicates.size} slug(s) duplicado(s) encontrado(s):\n${detail}`,
  )
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
      `[posts] Conflito de "order" na série "${seriesSlug}". Cada post deve ter um "order" único:\n${detail}`,
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
// # Readers
// ---------------------------------------------------------------------------

async function readSeries(): Promise<Map<string, Series>> {
  const dirs = await listSubdirectories(SERIES_DIR)

  const results = await Promise.allSettled(
    dirs.map(async (dir) => {
      const filePath = join(dir, 'index.json')

      let raw: string
      try {
        raw = await readFile(filePath, 'utf-8')
      } catch {
        throw new Error(`[series] Não foi possível ler o arquivo: ${filePath}`)
      }

      let parsed: unknown
      try {
        parsed = JSON.parse(raw)
      } catch (error) {
        throw new Error(
          `[series] JSON inválido em: ${filePath}\n  Motivo: ${error instanceof Error ? error.message : String(error)}`,
        )
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
      (r): r is PromiseFulfilledResult<{ data: Series; filePath: string }> =>
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
        throw new Error(`[posts] Não foi possível ler o arquivo: ${filePath}`)
      }

      const { data: frontmatter, content } = matter(raw)

      const result = postSchema.safeParse(frontmatter)
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
        `  - "${p.slug}" referencia a série "${p.series}" (não encontrada)\n    Arquivo: ${p.filePath}`,
    )
    .join('\n')

  const available =
    knownSeries.size > 0 ?
      `\n  - Séries disponíveis: ${[...knownSeries].map((s) => `"${s}"`).join(', ')}`
    : '\nNenhuma série foi encontrada.'

  throw new Error(
    `[posts] Séries inexistentes referenciadas:\n${detail}${available}`,
  )
}

// ---------------------------------------------------------------------------
// # Index builders
// ---------------------------------------------------------------------------

async function buildPostsIndex(posts: PostIndex[]): Promise<void> {
  const sorted = [...posts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map((post) => ({
      ...post,
      filePath: post.filePath.replaceAll('\\', '/'),
    }))

  await writeJson(OUTPUT_POSTS, sorted)
  console.info(`✔ posts-index.json → ${sorted.length} post(s)`)
}

async function buildSeriesIndex(
  seriesMap: Map<string, Series>,
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
  console.info(`✔ series-index.json → ${seriesWithPosts.length} série(s)`)
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
    .map((r) =>
      r.reason instanceof Error ? r.reason.message : String(r.reason),
    )

  if (errors.length > 0) {
    throw new Error(
      `${errors.length} contexto(s) com erro durante a geração dos índices:\n\n---\n\n${errors.join('\n\n---\n\n')}`,
    )
  }

  const seriesMap = unwrap(seriesResult)
  const posts = unwrap(postsResult)

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
  console.error('')
  console.error('---')
  console.error('')
  console.error('> Corrija os erros acima e tente novamente.')
  console.error('')
  process.exit(1)
})
