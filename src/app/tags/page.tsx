import Link from 'next/link'

import { getTagsWithCount } from '@/lib/blog'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tags',
  description: 'Navegue pelos posts por tema.',
}

export default function TagsPage() {
  const tagsWithCount = getTagsWithCount()
  const hasTags = tagsWithCount.length > 0

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='border-b border-zinc-100 pb-4 dark:border-zinc-800'>
        <p className='text-sm text-zinc-500 dark:text-zinc-400'>
          {tagsWithCount.length} {tagsWithCount.length === 1 ? 'tag' : 'tags'}
        </p>
      </div>

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
        <div className='py-16 text-center'>
          <p className='text-sm text-zinc-500 dark:text-zinc-400'>
            Nenhuma tag encontrada.
          </p>
        </div>
      )}
    </div>
  )
}
