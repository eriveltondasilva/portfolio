import { LayersIcon } from 'lucide-react'
import Link from 'next/link'
import clsx from 'clsx'

import { getSeriesBySlug } from '@/lib/blog/series'
import { Icon } from '@/components/icon'

interface Props {
  slug?: string
  order?: number
}

export function PostSeriesBanner({ slug, order }: Props) {
  if (!slug || !order) return null

  const series = getSeriesBySlug(slug)

  if (!series) return null

  const total = series.posts.length

  return (
    <section aria-label='Nesta série' className='mb-6'>
      <h2 className='mb-3 flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-zinc-50'>
        <Icon iconNode={LayersIcon} className='text-orange-500' />
        Nesta série
      </h2>

      <div className='rounded-md border border-orange-200/60 bg-orange-50/40 px-4 py-3 dark:border-orange-400/10 dark:bg-orange-400/5'>
        {/* Series label + title */}
        <div className='flex items-center justify-between gap-3'>
          <Link
            href={`/series/${series.slug}`}
            className='flex items-center gap-1.5 text-xs font-semibold text-orange-600 hover:underline dark:text-orange-400'
          >
            {series.title}
          </Link>

          <span className='shrink-0 text-xs text-zinc-400 dark:text-zinc-500'>
            {order} de {total} {total === 1 ? 'post' : 'posts'}
          </span>
        </div>

        {/* Posts list */}
        <ol className='mt-2.5 space-y-1'>
          {series.posts.map((post) => {
            const isCurrent = post.order === order

            return (
              <li key={post.slug} className='flex items-baseline gap-2'>
                <span
                  className={clsx(
                    'min-w-4 text-right text-xs tabular-nums',
                    isCurrent ?
                      'text-orange-500 dark:text-orange-400'
                    : 'text-zinc-400 dark:text-zinc-600',
                  )}
                >
                  {post.order}.
                </span>

                {isCurrent && (
                  <span className='text-sm font-medium text-zinc-900 dark:text-zinc-50'>
                    {post.title}
                  </span>
                )}
                {!isCurrent && (
                  <Link
                    href={`/blog/${post.slug}`}
                    className='text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
                  >
                    {post.title}
                  </Link>
                )}
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
