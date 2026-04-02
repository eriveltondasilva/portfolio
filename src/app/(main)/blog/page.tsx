import { LayersIcon } from 'lucide-react'

import { Icon } from '@/components/icon'
import { PostCard } from '@/components/post-card'
import { getAllPosts } from '@/lib/blog/posts'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Todos os artigos sobre desenvolvimento frontend.',
}

export default function BlogPage() {
  const posts = getAllPosts()
  const hasPosts = posts.length > 0
  const postCount = posts.length

  return (
    <div className='space-y-6'>
      {/* Header */}
      {hasPosts && (
        <div className='flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400'>
          <Icon iconNode={LayersIcon} className='size-3.5' />
          {postCount} {postCount > 1 ? 'posts publicados' : 'post publicado'}
        </div>
      )}

      {/* Posts list */}
      {hasPosts && (
        <div className='space-y-3'>
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} showSeriesBadge />
          ))}
        </div>
      )}

      {!hasPosts && (
        <div className='py-16 text-center'>
          <p className='text-sm text-zinc-500 dark:text-zinc-400'>
            Nenhum post publicado ainda.
          </p>
        </div>
      )}
    </div>
  )
}
