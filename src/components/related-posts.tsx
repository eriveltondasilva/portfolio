import { ArrowRightIcon, ClockIcon, SparklesIcon } from 'lucide-react'
import Link from 'next/link'

import { Icon } from '@/components/icon'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib'
import { getRelatedPosts } from '@/lib/blog/posts'

interface Props {
  slug: string
}

export function RelatedPosts({ slug }: Props) {
  const posts = getRelatedPosts(slug)

  if (posts.length === 0) return null

  return (
    <section>
      <h2 className='mb-3 flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-zinc-50'>
        <Icon iconNode={SparklesIcon} className='text-orange-500' />
        Posts relacionados
      </h2>

      <ul className='divide-y divide-zinc-100 dark:divide-zinc-800'>
        {posts.map((post) => (
          <li key={post.slug} className='group py-3'>
            <Link href={`/blog/${post.slug}`} className='flex items-start justify-between gap-4'>
              {/* Left: title + meta */}
              <div className='min-w-0 space-y-1.5'>
                <p className='truncate text-sm font-medium text-zinc-700 transition-colors group-hover:text-blue-600 dark:text-zinc-300 dark:group-hover:text-blue-400'>
                  {post.title}
                </p>

                <div className='flex flex-wrap items-center gap-3 text-xs text-zinc-400 dark:text-zinc-600'>
                  <time dateTime={post.publishedAt}>
                    {formatDate(post.publishedAt)}
                  </time>

                  <span className='flex items-center gap-1'>
                    <Icon iconNode={ClockIcon} className='size-3' />
                    {post.readingTime} min
                  </span>

                  {post.tags.slice(0, 2).map((tag) => (
                    <Badge
                      key={tag}
                      variant='secondary'
                      className='rounded-full bg-zinc-100 px-2 py-0 text-xs text-zinc-500 dark:bg-zinc-800 dark:text-zinc-500'
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Right: arrow */}
              <Icon
                iconNode={ArrowRightIcon}
                className='mt-0.5 size-3.5 shrink-0 text-zinc-300 transition-colors group-hover:text-blue-500 dark:text-zinc-700 dark:group-hover:text-blue-400'
              />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}