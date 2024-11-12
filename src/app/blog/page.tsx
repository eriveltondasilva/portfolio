import clsx from 'clsx'
import { Calendar, Info, Link2 as LinkIcon } from 'lucide-react'
import { type Metadata } from 'next'
import Link from 'next/link'

import { Alert } from '@/components/alert'
import { Badge } from '@/components/badge'

import { getAllPostMetadata } from '@/services/post-service'
import { type Post } from '@/types'
import { formatDate } from '@/utils/date-format'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Blog page',
}

function ListItem({ post }: { post: Post }) {
  const { title, description, createdAt, slug, tags } = post
  const date = formatDate(createdAt)

  return (
    <li className='space-y-1 text-neutral-700 dark:text-neutral-400'>
      <header>
        <Link
          className={clsx(
            'flex gap-2 font-semibold',
            'hover:underline hover:underline-offset-2',
            'text-neutral-900 dark:text-neutral-50',
            'decoration-sky-600 decoration-3',
            'dark:decoration-sky-400',
          )}
          href={`/blog/${slug}`}
        >
          <LinkIcon />
          <h2>{title.toUpperCase()}</h2>
        </Link>
      </header>

      <div className='flex flex-wrap gap-y-2'>
        {tags?.map((tag) => <Badge key={tag}>{tag}</Badge>)}
      </div>

      <p>{description || 'No description.'}</p>

      <div className='flex gap-2 text-sm'>
        <Calendar className='size-4' />
        <time>{date}</time>
      </div>
    </li>
  )
}

export default async function BlogPage() {
  const posts: Post[] = await getAllPostMetadata()

  return (
    <div>
      <header>
        <h1 className='title'>My Blog:</h1>
      </header>

      {!posts.length && (
        <Alert icon={Info}>There are no posts to display.</Alert>
      )}

      <ul className='space-y-8'>
        {posts?.map((post) => <ListItem key={post.slug} post={post} />)}
      </ul>
    </div>
  )
}
