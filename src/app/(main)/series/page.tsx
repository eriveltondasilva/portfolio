import { FolderXIcon, LayersIcon } from 'lucide-react';

import { Icon } from '@/components/icon';
import { SeriesCard } from '@/components/cards/series-card';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { getAllSeries } from '@/lib/blog/series';
import { OG_LOCALE, SITE_NAME, TWITTER_HANDLE } from '@/lib/constants';

import type { Metadata } from 'next';

const meta = {
  title: 'Séries',
  description: 'Coleções de posts organizados por tema.',
};

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: '/series' },
  openGraph: {
    type: 'website',
    url: '/series',
    locale: OG_LOCALE,
    siteName: SITE_NAME,
    title: meta.title,
    description: meta.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: meta.title,
    description: meta.description,
    site: TWITTER_HANDLE,
    creator: TWITTER_HANDLE,
  },
};

export default function SeriesPage() {
  const series = getAllSeries();
  const seriesCount = series.length;
  const hasSeries = seriesCount > 0;

  return (
    <div className='space-y-6'>
      {/* Page title */}
      <h1 className='sr-only'>Séries</h1>

      {/* Header */}
      {hasSeries && (
        <div className='flex items-center gap-1.5 text-sm text-muted-foreground'>
          <Icon iconNode={LayersIcon} className='size-3.5' />
          {seriesCount} {seriesCount === 1 ? 'série' : 'séries'}
        </div>
      )}

      {/* Series */}
      {hasSeries && (
        <div className='space-y-6'>
          {series.map((item) => (
            <SeriesCard key={item.slug} series={item} showStatusBadge />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!hasSeries && (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant='icon'>
              <FolderXIcon />
            </EmptyMedia>

            <EmptyTitle>Nenhuma série criada</EmptyTitle>

            <EmptyDescription>
              As séries de posts aparecerão aqui quando forem criadas.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
    </div>
  );
}
