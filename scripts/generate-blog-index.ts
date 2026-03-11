import { join } from 'node:path'
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

async function listSubdirectories(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true })
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => join(dir, entry.name))
}

async function readSeries(): Promise<Map<string, SeriesMeta>> {
  const seriesMap = new Map<string, SeriesMeta>()

  const dirs = await listSubdirectories(SERIES_DIR)

  await Promise.all(
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

      seriesMap.set(result.data.slug, result.data)
    }),
  )

  return seriesMap
}

async function readPosts(knownSeries: Set<string>): Promise<PostIndex[]> {
  const dirs = await listSubdirectories(POSTS_DIR)

  const results = await Promise.all(
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

      // Filter unpublished posts
      if (!post.published) return null

      // Validate series reference
      if (post.series && !knownSeries.has(post.series)) {
        throw new Error(
          `[posts] Post "${post.slug}" referencia a série "${post.series}" que não existe.`,
        )
      }

      return {
        ...post,
        readingTime: readingTime(content).minutes,
      }
    }),
  )

  return results.filter((post): post is PostIndex => post !== null)
}

async function writeJson(filePath: string, data: unknown): Promise<void> {
  await writeFile(filePath, JSON.stringify(data, null, 2) + '\n', 'utf-8')
}

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
        .filter((p) => p.series === series.slug)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .map((p) => ({
          slug: p.slug,
          title: p.title,
          order: p.order as number,
        }))

      return { ...series, posts: relatedPosts }
    })

  await writeJson(OUTPUT_SERIES, seriesWithPosts)
  console.log(`✔ series-index.json → ${seriesWithPosts.length} série(s)`)
}

async function main(): Promise<void> {
  console.log('> Gerando índices do blog...\n')

  const seriesMap = await readSeries()
  const posts = await readPosts(new Set(seriesMap.keys()))

  await Promise.all([
    buildPostsIndex(posts),
    buildSeriesIndex(seriesMap, posts),
  ])

  console.log('\n> Índices gerados com sucesso.')
}

main().catch((err: unknown) => {
  console.error('\n> Erro ao gerar índices:')
  console.error(err instanceof Error ? err.message : err)
  process.exit(1)
})
