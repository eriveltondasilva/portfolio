import seriesIndex from '@/content/indexes/series.json'
import { SeriesStatus } from '@/lib/constants'

import type { SeriesIndex } from '@/types'

export function getAllSeries(): SeriesIndex[] {
  return seriesIndex as SeriesIndex[]
}

export function getSeriesBySlug(slug: string): SeriesIndex | null {
  return getAllSeries().find((series) => series.slug === slug) ?? null
}

/** Retorna séries com status IN_PROGRESS, usadas na home. */
export function getRecentSeries(limit = 3): SeriesIndex[] {
  return getAllSeries()
    .filter((series) => series.status === SeriesStatus.IN_PROGRESS)
    .slice(0, limit)
}
