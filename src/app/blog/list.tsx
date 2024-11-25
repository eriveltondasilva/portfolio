import clsx from 'clsx'
import { Link2Icon } from 'lucide-react'
import Link from 'next/link'

import { Badge } from '@/components/badge'
import { Metadata } from '@/components/metadata'
import { Separator } from '@/components/separator'

import { Post } from '@/types'

type ListProp = { posts: Post[]; count: number }
export async function List({ posts, count }: ListProp) {
  return (
    <ul className='space-y-8'>
      {posts?.map((post, index) => (
        <li
          key={post.slug.join('-')}
          className='text-neutral-700 dark:text-neutral-400'
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
              : <Badge>no tags</Badge>}
            </div>

            <p>{post.description || 'No description.'}</p>

            <Metadata
              createdAt={post.createdAt}
              readingTime={post.readingTime}
            />
          </article>
          {index < count - 1 && <Separator />}
        </li>
      ))}
    </ul>
  )
}
