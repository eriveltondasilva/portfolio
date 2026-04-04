import { HashIcon, LayersIcon } from 'lucide-react'
import Link from 'next/link'

import { Icon } from '@/components/icon'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { getTagsWithCount } from '@/lib/blog/tags'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tags',
  description: 'Navegue pelos posts por tema.',
}

export default function TagsPage() {
  const tagsWithCount = getTagsWithCount()
  const hasTags = tagsWithCount.length > 0
  const tagCount = tagsWithCount.length

  return (
    <div className='space-y-6'>
      {/* Header */}
      {hasTags && (
        <div className='flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400'>
          <Icon iconNode={LayersIcon} className='size-3.5' />
          {tagCount} {tagCount > 1 ? 'tags' : 'tag'}
        </div>
      )}

      {/* Tags grid */}
      {hasTags && (
        <div className='flex flex-wrap gap-2'>
          {tagsWithCount.map(({ tag, count }) => (
            <Link
              key={tag}
              href={`/tags/${tag}`}
              className='group flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm transition-colors hover:border-blue-300 hover:bg-blue-50 dark:border-zinc-700/60 dark:bg-zinc-800/40 dark:hover:border-blue-700 dark:hover:bg-blue-900/20'
            >
              <span className='font-medium text-zinc-700 group-hover:text-blue-700 dark:text-zinc-300 dark:group-hover:text-blue-300'>
                {tag}
              </span>
              <span className='rounded-full bg-zinc-200 px-1.5 py-0.5 text-xs font-medium text-zinc-600 group-hover:bg-blue-100 group-hover:text-blue-700 dark:bg-zinc-700 dark:text-zinc-400 dark:group-hover:bg-blue-900/50 dark:group-hover:text-blue-300'>
                {count}
              </span>
            </Link>
          ))}
        </div>
      )}

      {!hasTags && (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant='icon'>
              <HashIcon />
            </EmptyMedia>
            <EmptyTitle>Nenhuma tag encontrada</EmptyTitle>
            <EmptyDescription>
              As tags são criadas automaticamente a partir dos posts publicados.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
    </div>
  )
}
