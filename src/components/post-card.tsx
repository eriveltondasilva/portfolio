import { BookOpenIcon, CalendarIcon, ClockIcon } from 'lucide-react'
import Link from 'next/link'

import { cn } from '@/lib/utils'

import { Badge } from './ui/badge'

import type { PostIndex } from '@/types'

interface PostCardProps {
  post: PostIndex
  className?: string
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function PostCard({ post, className }: PostCardProps) {
  return (
    <article
      className={cn(
        'group relative flex flex-col rounded-md border border-zinc-200 bg-white p-5 transition-colors hover:border-zinc-300 hover:bg-zinc-50/50 dark:border-zinc-700/60 dark:bg-zinc-900/30 dark:hover:border-zinc-600 dark:hover:bg-zinc-800/30',
        className,
      )}
    >
      {/* Header */}
      <div className='flex items-start gap-3'>
        <BookOpenIcon className='mt-0.5 h-4 w-4 shrink-0 text-blue-500 dark:text-blue-400' />
        <div className='min-w-0 flex-1'>
          <Link
            href={`/blog/${post.slug}`}
            className='font-semibold text-blue-600 hover:underline dark:text-blue-400'
          >
            {post.title}
          </Link>
          <p className='mt-1 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400'>
            {post.description}
          </p>
        </div>
      </div>

      {/* Tags */}
      {post.tags.length > 0 && (
        <div className='mt-3 flex flex-wrap gap-1.5'>
          {post.tags.map((tag) => (
            <Link key={tag} href={`/tags/${tag}`}>
              <Badge
                variant='secondary'
                className='rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 transition-colors hover:bg-blue-50 hover:text-blue-700 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-blue-900/30 dark:hover:text-blue-300'
              >
                {tag}
              </Badge>
            </Link>
          ))}
        </div>
      )}

      {/* Meta */}
      <div className='mt-3 flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-500'>
        <span className='flex items-center gap-1.5'>
          <CalendarIcon className='h-3.5 w-3.5' />
          {formatDate(post.publishedAt)}
        </span>
        {post.readingTime > 0 && (
          <span className='flex items-center gap-1.5'>
            <ClockIcon className='h-3.5 w-3.5' />
            {post.readingTime} min de leitura
          </span>
        )}
        {post.series && (
          <span className='flex items-center gap-1 text-orange-500 dark:text-orange-400'>
            <span className='inline-block h-2 w-2 rounded-full bg-orange-500 dark:bg-orange-400' />
            Série
          </span>
        )}
      </div>
    </article>
  )
}
