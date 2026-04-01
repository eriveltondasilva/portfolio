import { SeriesCard } from '#/components/series-card'
import { getAllSeries } from '#/lib/blog/series'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Séries',
  description: 'Coleções de posts organizados por tema.',
}

export default function SeriesPage() {
  const series = getAllSeries()
  const hasSeries = series.length > 0

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='border-b border-zinc-100 pb-4 dark:border-zinc-800'>
        <p className='text-sm text-zinc-500 dark:text-zinc-400'>
          {series.length} {series.length === 1 ? 'série' : 'séries'}
        </p>
      </div>

      {/* Series list */}
      {hasSeries && (
        <div className='space-y-3'>
          {series.map((s) => (
            <SeriesCard key={s.slug} series={s} />
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
