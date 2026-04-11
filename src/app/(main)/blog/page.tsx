import { FileXIcon, LayersIcon } from 'lucide-react'

import { Icon } from '@/components/icon'
import { PostCard } from '@/components/post-card'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { getAllPosts } from '@/lib/blog/posts'

import type { Metadata } from 'next'

const meta = {
  title: 'Blog',
  description: 'Todos os artigos sobre desenvolvimento frontend.',
  siteName: "Erivelton's Portfolio",
}

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: '/blog' },
  openGraph: {
    type: 'website',
    url: '/blog',
    title: meta.title,
    description: meta.description,
    siteName: meta.siteName,
  },
  twitter: {
    card: 'summary',
    title: meta.title,
    description: meta.description,
    site: meta.siteName,
    creator: '@erivelton_silv4',
  },
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
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant='icon'>
              <FileXIcon />
            </EmptyMedia>
            <EmptyTitle>Nenhum post publicado</EmptyTitle>
            <EmptyDescription>
              Os artigos aparecerão aqui assim que forem publicados.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
    </div>
  )
}
