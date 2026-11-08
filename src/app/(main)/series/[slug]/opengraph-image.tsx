import { getAllSeries, getSeriesBySlug } from '@/lib/blog/series';
import {
  AUTHOR_NAME,
  SERIES_STATUS_LABEL,
  SeriesStatus,
} from '@/lib/constants';
import { formatDate, formatReadingTime } from '@/lib/format';
import {
  OG_CONTENT_TYPE,
  OG_SIZE,
  OgLayout,
  OgPill,
  OgPillRow,
} from '@/lib/og/layout';
import { renderOgImage, renderOgNotFound } from '@/lib/og/response';

import type { OgPillColors } from '@/lib/og/layout';

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = `${AUTHOR_NAME} — Séries`;

const statusColors: Record<SeriesStatus, OgPillColors> = {
  [SeriesStatus.PLANNED]: {
    background: '#f9fafb',
    border: '#e5e7eb',
    color: '#6b7280',
  },
  [SeriesStatus.IN_PROGRESS]: {
    background: '#fffbeb',
    border: '#fde68a',
    color: '#d97706',
  },
  [SeriesStatus.COMPLETE]: {
    background: '#f0fdf4',
    border: '#bbf7d0',
    color: '#16a34a',
  },
};

export function generateStaticParams() {
  return getAllSeries().map(({ slug }) => ({ slug }));
}

export default async function OGImage({ params }: PageProps<'/series/[slug]'>) {
  const { slug } = await params;
  const series = getSeriesBySlug(slug);

  if (!series) return renderOgNotFound();

  const postCount = series.posts.length;
  const postsLabel = `${postCount} ${postCount === 1 ? 'post' : 'posts'}`;
  const summaryLabel =
    postCount > 0 ?
      `${postsLabel} · ${formatReadingTime(series.readingTime)} de leitura`
    : postsLabel;
  const publishedDate = formatDate(series.publishedAt, { dateStyle: 'medium' });

  return renderOgImage(
    <OgLayout
      title={series.title}
      description={series.description}
      footerStart={summaryLabel}
      footerEnd={`Publicada em ${publishedDate}`}
    >
      <OgPillRow>
        <OgPill
          label={SERIES_STATUS_LABEL[series.status]}
          colors={statusColors[series.status]}
          showDot
        />
      </OgPillRow>
    </OgLayout>,
  );
}
