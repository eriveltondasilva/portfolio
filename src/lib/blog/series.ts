import 'server-only';

import seriesIndex from '@/generated/indexes/series.json';
import { SeriesStatus } from '@/lib/constants';

import type { SeriesIndex } from '@/types';

const allSeries = seriesIndex as SeriesIndex[];
const seriesBySlug = new Map(allSeries.map((series) => [series.slug, series]));

// ─────────────────────────────────────

export function getAllSeries(): ReadonlyArray<SeriesIndex> {
  return allSeries;
}

export function getSeriesBySlug(slug: string): Readonly<SeriesIndex> | null {
  return seriesBySlug.get(slug) ?? null;
}

export function getInProgressSeries(limit = 2): ReadonlyArray<SeriesIndex> {
  return allSeries.filter((series) => series.status === SeriesStatus.IN_PROGRESS).slice(0, limit);
}
