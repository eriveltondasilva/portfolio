import { FolderXIcon, LayersIcon } from 'lucide-react'

import { Icon } from '@/components/icon'
import { SeriesCard } from '@/components/series-card'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { getAllSeries } from '@/lib/blog/series'

import type { Metadata } from 'next'

const meta = {
  title: 'Séries',
  description: 'Coleções de posts organizados por tema.',
  siteName: "Erivelton's Portfolio",
}

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: '/series' },
  openGraph: {
    type: 'website',
    url: '/series',
    title: meta.title,
    description: meta.description,
    siteName: meta.siteName,
  },
  twitter: {
    card: 'summary',
    title: meta.title,
    description: meta.description,
    site: meta.siteName,
    creator: '@erivelton_silv4',
  },
}

export default function SeriesPage() {
  const series = getAllSeries()
  const hasSeries = series.length > 0
  const seriesCount = series.length

  return (
    <div className='space-y-6'>
      {/* Header */}
      {hasSeries && (
        <div className='flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400'>
          <Icon iconNode={LayersIcon} className='size-3.5' />
          {seriesCount} {seriesCount > 1 ? 'séries' : 'série'}
        </div>
      )}

      {hasSeries && (
        <div className='space-y-3'>
          {series.map((s) => (
            <SeriesCard key={s.slug} series={s} showStatusBadge />
          ))}
        </div>
      )}

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
  )
}
