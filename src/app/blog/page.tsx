import { PostCard } from '@/components/post-card'
import { getAllPosts } from '@/lib/posts'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Todos os artigos sobre desenvolvimento frontend.',
}

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='border-b border-zinc-100 pb-4 dark:border-zinc-800'>
        <p className='text-sm text-zinc-500 dark:text-zinc-400'>
          {posts.length}{' '}
          {posts.length === 1 ? 'post publicado' : 'posts publicados'}
        </p>
      </div>

      {/* Posts list */}
      {posts.length > 0 ?
        <div className='space-y-3'>
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      : <div className='py-16 text-center'>
          <p className='text-sm text-zinc-500 dark:text-zinc-400'>
            Nenhum post publicado ainda.
          </p>
        </div>
      }
    </div>
  )
}
