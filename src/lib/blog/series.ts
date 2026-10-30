import seriesIndex from '@/generated/indexes/series.json';
import { SeriesStatus } from '@/lib/constants';

import type { SeriesIndex } from '@/types';

const allSeries = seriesIndex as SeriesIndex[];
const seriesBySlug = new Map(allSeries.map((series) => [series.slug, series]));

export function getAllSeries(): SeriesIndex[] {
  return [...allSeries];
}

export function getSeriesBySlug(slug: string): SeriesIndex | null {
  return seriesBySlug.get(slug) ?? null;
}

/** Series with IN_PROGRESS status, shown on the home page. */
export function getInProgressSeries(limit = 3): SeriesIndex[] {
  return allSeries
    .filter((series) => series.status === SeriesStatus.IN_PROGRESS)
    .slice(0, limit);
}
