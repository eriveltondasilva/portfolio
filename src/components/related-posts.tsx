import { ArrowRightIcon, DotIcon, FileTextIcon } from 'lucide-react'
import Link from 'next/link'

import { Icon } from '@/components/icon'
import { formatDate } from '@/lib'
import { getRelatedPosts } from '@/lib/blog/posts'
import { Separator } from '@/components/separator'

interface Props {
  slug: string
}

export function RelatedPosts({ slug }: Props) {
  const posts = getRelatedPosts(slug)

  if (posts.length === 0) return null

  return (
    <section aria-label='Posts relacionados'>
      <Separator />

      <h2 className='flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-zinc-50'>
        <Icon iconNode={FileTextIcon} className='text-blue-500' />
        Posts relacionados
      </h2>

      <ul className='divide-y divide-zinc-100 dark:divide-zinc-800'>
        {posts.map((post) => (
          <li key={post.slug} className='group py-3'>
            <Link href={`/blog/${post.slug}`} className='flex items-start justify-between gap-4'>
              <div className='min-w-0 space-y-1.5'>
                <p className='truncate text-sm font-medium text-zinc-700 transition-colors group-hover:text-blue-600 dark:text-zinc-300 dark:group-hover:text-blue-400'>
                  {post.title}
                </p>

                <div className='flex flex-wrap items-center text-xs text-zinc-400 dark:text-zinc-600'>
                  <time dateTime={post.updatedAt ?? post.publishedAt}>
                    {formatDate(post.updatedAt ?? post.publishedAt)}
                  </time>
                  <Icon iconNode={DotIcon} className='size-5' />
                  <span className='flex items-center gap-1'>{post.readingTime} min de leitura</span>
                </div>
              </div>

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
