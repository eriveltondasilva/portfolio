import { BuildError } from './utils'

import type { PostIndex } from '@/types'

type SeriesPost = PostIndex & { series: string; order: number }

export function assertUniqueSeriesOrder(posts: PostIndex[]): void {
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

export function assertAuthorsExist(
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

export function assertUniqueSlugs(
  context: string,
  entries: { slug: string; source: string }[],
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
