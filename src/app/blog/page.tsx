import { Link2 as LinkIcon } from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'

import { getAllPostMetadata } from '@/services/post-service'
import { formatDate } from '@/utils/date-format'

export const metadata: Metadata = {
  title: 'Blog',
}

export default async function BlogPage() {
  const posts = await getAllPostMetadata()

  return (
    <>
      <h1 className='title'>My Blog</h1>
      <br />
      <ul className='space-y-5'>
        {posts.map((post) => (
          <li key={post.slug}>
            <Link className='flex gap-2' href={`/blog/${post.slug}`}>
              <LinkIcon />
              <h2>{post.title.toUpperCase()}</h2>
            </Link>

            <p>{post.description}</p>
            <time>{formatDate(post.createdAt)}</time>
          </li>
        ))}
      </ul>
    </>
  )
}
