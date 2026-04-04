import { CalendarIcon, FolderIcon, LayersIcon } from 'lucide-react'
import Link from 'next/link'

import { formatDate } from '@/lib'
import { cn } from '@/lib/utils'
import { SeriesStatus } from '@/lib/constants'

import { Icon } from './icon'
import { Badge } from './ui/badge'

import type { SeriesIndex } from '@/types'
import type { ComponentPropsWithoutRef } from 'react'

interface SeriesCardProps extends ComponentPropsWithoutRef<'article'> {
  series: SeriesIndex
  showStatusBadge?: boolean
}

interface BadgeProps {
  label: string
  className: string
  dot: string
}

const statusConfig: Record<SeriesStatus, BadgeProps> = {
  [SeriesStatus.PLANNED]: {
    label: 'Em planejamento',
    dot: 'bg-primary size-1.5 rounded-full',
    className: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
  },
  [SeriesStatus.IN_PROGRESS]: {
    label: 'Em progresso',
    dot: 'size-1.5 rounded-full bg-amber-500',
    className:
      'border-none bg-amber-600/10 text-amber-600 dark:bg-amber-400/10 dark:text-amber-400',
  },
  [SeriesStatus.COMPLETE]: {
    label: 'Completa',
    dot: 'size-1.5 rounded-full bg-green-500',
    className:
      'border-none bg-green-600/10 text-green-600 dark:bg-green-400/10 dark:text-green-400',
  },
}

export function SeriesCard({ series, showStatusBadge = false, ...props }: SeriesCardProps) {
  const status = statusConfig[series.status]
  const postCount = series.posts.length

  return (
    <article
      className={cn(
        'group flex flex-col rounded-md border border-zinc-200 bg-white p-5 transition-colors hover:border-zinc-300 hover:bg-zinc-50/50 dark:border-zinc-700/60 dark:bg-zinc-900/30 dark:hover:border-zinc-600 dark:hover:bg-zinc-800/30',
        props.className,
      )}
      {...props}
    >
      {/* Header */}
      <div className='flex items-start justify-between gap-4'>
        <div className='flex items-center gap-2 text-orange-500 dark:text-orange-400'>
          <Icon iconNode={FolderIcon} />
          <Link
            href={`/series/${series.slug}`}
            className='font-semibold text-balance hover:underline'
          >
            {series.title}
          </Link>
        </div>

        {showStatusBadge && (
          <Badge className={status.className}>
            <span className={status.dot} aria-hidden='true' />
            {status.label}
          </Badge>
        )}
      </div>

      {/* Description */}
      <p className='mt-1 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400'>
        {series.description}
      </p>

      {/* Meta info */}
      <div className='mt-3 flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-500'>
        <span className='flex items-center gap-1.5'>
          <Icon iconNode={LayersIcon} className='size-3.5' />
          <span>
            {postCount} {postCount > 1 ? 'posts' : 'post'} nesta série
          </span>
        </span>

        <span className='flex items-center gap-1.5'>
          <Icon iconNode={CalendarIcon} className='size-3.5' />
          <time dateTime={series.publishedAt}>{formatDate(series.publishedAt)}</time>
        </span>
      </div>

      {/* Posts list */}
      {postCount > 0 && (
        <ol className='mt-3 space-y-1 border-t border-zinc-100 pt-3 dark:border-zinc-700/60'>
          {series.posts.slice(0, 3).map((post) => (
            <li key={post.slug} className='flex items-center gap-2'>
              <span className='min-w-5 text-center text-xs text-zinc-400'>{post.order}.</span>
              <Link
                href={`/blog/${post.slug}`}
                className='truncate text-sm text-zinc-600 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400'
              >
                {post.title}
              </Link>
            </li>
          ))}
          {postCount > 3 && <li className='pl-6 text-xs text-zinc-400'>+{postCount - 3} mais</li>}
        </ol>
      )}
    </article>
  )
}
