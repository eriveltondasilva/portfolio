import { BuildError } from './utils'

import type { PostIndex } from '@/types'

export function assertUniqueSeriesOrder(posts: readonly PostIndex[]): void {
  const index = new Map<string, Map<number, string[]>>()

  for (const { series, order, filePath } of posts) {
    if (series === undefined || order === undefined) continue

    let orderMap = index.get(series)
    if (!orderMap) {
      orderMap = new Map()
      index.set(series, orderMap)
    }

    const files = orderMap.get(order)
    if (files) {
      files.push(filePath)
    } else {
      orderMap.set(order, [filePath])
    }
  }

  const conflicts: string[] = []

  for (const [seriesSlug, orderMap] of index) {
    const lines: string[] = []

    for (const [order, files] of orderMap) {
      if (files.length <= 1) continue

      const detail = files.map((f) => `\n    - ${f}`).join('')
      lines.push(`  order ${order}:${detail}`)
    }

    if (lines.length > 0) {
      conflicts.push(
        `Series "${seriesSlug}" has duplicate "order" values:\n${lines.join('\n')}`,
      )
    }
  }

  if (conflicts.length === 0) return

  throw new BuildError('posts', conflicts)
}

export function assertSeriesExist(
  posts: PostIndex[],
  knownSeries: Set<string>,
): void {
  const invalid = posts.filter(
    (p) => p.series !== undefined && !knownSeries.has(p.series),
  )

  if (invalid.length === 0) return

  const detail = invalid
    .map(
      (post) =>
        `  - "${post.slug}" -> série "${post.series}"\n    ${post.filePath}`,
    )
    .join('\n')

  const available =
    knownSeries.size > 0 ?
      `\n  Series available: ${[...knownSeries].map((s) => `"${s}"`).join(', ')}`
    : '\n  No series found.'

  const message = `Non-existent series referenced:\n${detail}${available}`
  throw new BuildError('posts', [message])
}

export function assertAuthorsExist(
  posts: readonly PostIndex[],
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

  const message = `Non-existent authors referenced:\n${detail}${available}`
  throw new BuildError('posts', [message])
}

interface Entry {
  slug: string
  source: string
}

export function assertUniqueSlugs(
  context: string,
  entries: readonly Entry[],
): void {
  const seen = new Map<string, string[]>()
  let hasDuplicates = false

  for (const { slug, source } of entries) {
    const sources = seen.get(slug)

    if (sources) {
      sources.push(source)
      hasDuplicates = true
    } else {
      seen.set(slug, [source])
    }
  }

  if (!hasDuplicates) return

  const detail: string[] = []

  for (const [slug, sources] of seen) {
    if (sources.length <= 1) continue

    const files = [...new Set(sources)]
      .map((source) => `\n    - ${source}`)
      .join('')
    detail.push(`  "${slug}" found in:${files}`)
  }

  const message = `Duplicate slugs found:\n\n${detail.join('\n')}`
  throw new BuildError(context, [message])
}
