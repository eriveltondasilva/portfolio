import clsx from 'clsx'
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react'
import Link from 'next/link'

import { Icon } from './icon'

import type { PostIndex } from '#/types'

interface Props {
  post: PostIndex
  direction: 'prev' | 'next'
}

export function AdjacentPostCard({ post, direction }: Props) {
  const isPrev = direction === 'prev'

  return (
    <Link
      href={`/blog/${post.slug}`}
      className={clsx(
        'group flex min-w-0 flex-1 flex-col gap-1 rounded-md border border-zinc-200 p-4 transition-colors hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700/60 dark:hover:border-zinc-600 dark:hover:bg-zinc-800/30',
        !isPrev && 'text-right',
      )}
    >
      <span
        className={clsx(
          'flex items-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-500',
          !isPrev && 'justify-end',
        )}
      >
        {isPrev && <Icon iconNode={ArrowLeftIcon} className='size-3' />}
        {isPrev ? 'Post anterior' : 'Próximo post'}
        {!isPrev && <Icon iconNode={ArrowRightIcon} className='size-3' />}
      </span>
      <span
        className={clsx(
          'line-clamp-2 text-sm font-medium text-zinc-700 transition-colors group-hover:text-zinc-900 dark:text-zinc-300 dark:group-hover:text-zinc-50',
          !isPrev && 'text-right',
        )}
      >
        {post.title}
      </span>
    </Link>
  )
}
