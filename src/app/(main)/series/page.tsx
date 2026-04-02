import { LayersIcon } from 'lucide-react'

import { Icon } from '@/components/icon'
import { SeriesCard } from '@/components/series-card'
import { getAllSeries } from '@/lib/blog/series'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Séries',
  description: 'Coleções de posts organizados por tema.',
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

      {/* Series list */}
      {hasSeries && (
        <div className='space-y-3'>
          {series.map((s) => (
            <SeriesCard key={s.slug} series={s} showStatusBadge />
          ))}
        </div>
      )}

      {!hasSeries && (
        <div className='py-16 text-center'>
          <p className='text-sm text-zinc-500 dark:text-zinc-400'>
            Nenhuma série criada ainda.
          </p>
        </div>
      )}
    </div>
  )
}
