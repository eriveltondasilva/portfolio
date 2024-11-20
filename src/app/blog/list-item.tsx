import clsx from 'clsx'
import { Link2 as LinkIcon } from 'lucide-react'
import Link from 'next/link'

import { Badge } from '@/components/badge'
import { Metadata } from '@/components/metadata'
import { Separator } from '@/components/separator'
import { type Post } from '@/types'

export function ListItem({
  post,
  postCount,
  index,
}: {
  post: Post | null
  postCount: number
  index: number
}) {
  if (!post) return null

  return (
    <>
      <li className='text-neutral-700 dark:text-neutral-400'>
        <article className='space-y-1'>
          <header>
            <Link
              className={clsx(
                'flex gap-2 font-semibold',
                'hover:underline hover:underline-offset-2',
                'text-neutral-900 dark:text-neutral-50',
                'decoration-sky-600 decoration-3',
                'dark:decoration-sky-400',
              )}
              href={`/blog/${post.slug}`}
            >
              <LinkIcon />
              <h2>{post.title.toUpperCase()}</h2>
            </Link>
          </header>

          <div className='flex flex-wrap gap-2'>
            {post?.tags?.map((tag) => <Badge key={tag}>{tag}</Badge>)}
            {!post.tags?.length && <Badge>no tags</Badge>}
          </div>

          <p>{post.description || 'No description.'}</p>

          <Metadata createdAt={post.createdAt} readingTime={post.readingTime} />
        </article>
      </li>
      {index < postCount - 1 && <Separator />}
    </>
  )
}
