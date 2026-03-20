import { BookMarkedIcon, LayersIcon } from 'lucide-react'
import Link from 'next/link'

import { cn } from '@/lib/utils'
import { SeriesStatus } from '@/types'

import { Badge } from './ui/badge'

import type { SeriesIndex } from '@/types'

interface SeriesCardProps {
  series: SeriesIndex
  className?: string
}

const statusConfig: Record<SeriesStatus, { label: string; className: string }> =
  {
    [SeriesStatus.PLANNED]: {
      label: 'Planejada',
      className:
        'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
    },
    [SeriesStatus.IN_PROGRESS]: {
      label: 'Em andamento',
      className:
        'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    },
    [SeriesStatus.COMPLETE]: {
      label: 'Completa',
      className:
        'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    },
  }

export function SeriesCard({ series, className }: SeriesCardProps) {
  const status = statusConfig[series.status as SeriesStatus]

  return (
    <article
      className={cn(
        'group flex flex-col rounded-md border border-zinc-200 bg-white p-5 transition-colors hover:border-zinc-300 hover:bg-zinc-50/50 dark:border-zinc-700/60 dark:bg-zinc-900/30 dark:hover:border-zinc-600 dark:hover:bg-zinc-800/30',
        className,
      )}
    >
      {/* Header */}
      <div className='flex items-start justify-between gap-4'>
        <div className='flex items-start gap-3'>
          <BookMarkedIcon className='mt-0.5 h-4 w-4 shrink-0 text-orange-500 dark:text-orange-400' />
          <div>
            <Link
              href={`/series/${series.slug}`}
              className='font-semibold text-blue-600 hover:underline dark:text-blue-400'
            >
              {series.title}
            </Link>
            <p className='mt-1 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400'>
              {series.description}
            </p>
          </div>
        </div>
        <Badge
          variant='secondary'
          className={cn('shrink-0 rounded-full text-xs', status?.className)}
        >
          {status?.label}
        </Badge>
      </div>

      {/* Posts count */}
      <div className='mt-3 flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-500'>
        <LayersIcon className='h-3.5 w-3.5' />
        <span>
          {series.posts.length} {series.posts.length === 1 ? 'post' : 'posts'}
        </span>
      </div>

      {/* Posts list preview */}
      {series.posts.length > 0 && (
        <ol className='mt-3 space-y-1 border-t border-zinc-100 pt-3 dark:border-zinc-700/60'>
          {series.posts.slice(0, 3).map((post) => (
            <li key={post.slug} className='flex items-center gap-2'>
              <span className='min-w-5 text-center text-xs text-zinc-400'>
                {post.order}.
              </span>
              <Link
                href={`/blog/${post.slug}`}
                className='truncate text-sm text-zinc-600 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400'
              >
                {post.title}
              </Link>
            </li>
          ))}
          {series.posts.length > 3 && (
            <li className='pl-6 text-xs text-zinc-400'>
              +{series.posts.length - 3} mais
            </li>
          )}
        </ol>
      )}
    </article>
  )
}
