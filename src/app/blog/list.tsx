import clsx from 'clsx'
import { Link2Icon } from 'lucide-react'
import Link from 'next/link'

import { Badge } from '@/components/badge'
import { Metadata } from '@/components/metadata'

import { type Post } from '@/types'

export async function List({ posts }: { posts: Post[] }) {
  return (
    <ul className='divide-y divide-gray-200 dark:divide-gray-700'>
      {posts.map((post) => (
        <li
          key={post.slug.join('-')}
          className={clsx(
            'flex py-6 first:pt-0 last:pb-0',
            'text-neutral-700 dark:text-neutral-400',
          )}
        >
          <article className='space-y-1'>
            <header>
              <Link
                href={`/blog/${post.slug.join('/')}`}
                className={clsx(
                  'flex gap-2 font-semibold',
                  'hover:underline hover:underline-offset-2',
                  'text-neutral-900 dark:text-neutral-50',
                  'decoration-sky-600 decoration-3',
                  'dark:decoration-sky-400',
                )}
              >
                <Link2Icon aria-hidden='true' />
                <h2>{post.title.toUpperCase()}</h2>
              </Link>
            </header>

            <div className='flex flex-wrap gap-2'>
              {!!post.tags.length ?
                post.tags.map((tag) => <Badge key={tag}>{tag}</Badge>)
              : <Badge>No tags</Badge>}
            </div>

            <p>{post.description || 'No description.'}</p>

            <Metadata
              createdAt={post.createdAt}
              readingTime={post.readingTime}
            />
          </article>
        </li>
      ))}
    </ul>
  )
}
