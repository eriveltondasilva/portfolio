import { ArrowLeftIcon, HashIcon, LayersIcon } from 'lucide-react'
import Link from 'next/link'

import { Icon } from '@/components/icon'
import { PostCard } from '@/components/post-card'
import { getPostsByTag } from '@/lib/blog/posts'
import { getAllTags } from '@/lib/blog/tags'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'

import type { Metadata } from 'next'

export const dynamicParams = false

export async function generateMetadata({ params }: PageProps<'/tags/[slug]'>): Promise<Metadata> {
  const { slug } = await params

  return {
    title: `#${slug}`,
    description: `Posts sobre ${slug}.`,
  }
}

export function generateStaticParams() {
  const tags = getAllTags()
  return tags.map((tag) => ({ slug: tag }))
}

export default async function TagPage({ params }: PageProps<'/tags/[slug]'>) {
  const { slug } = await params
  const posts = getPostsByTag(slug)
  const hasPosts = posts.length > 0
  const tagCount = posts.length

  return (
    <div className='space-y-6'>
      {/* Back link */}
      <Link
        href='/tags'
        className='inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
      >
        <Icon iconNode={ArrowLeftIcon} />
        Todas as tags
      </Link>

      {/* Header */}
      <header className='space-y-2'>
        <h1 className='flex items-center gap-2 text-xl font-bold text-zinc-900 dark:text-zinc-50'>
          <Icon iconNode={HashIcon} className='size-5 text-zinc-400' />
          {slug}
        </h1>
        <p className='flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400'>
          <Icon iconNode={LayersIcon} className='size-3.5' />
          {tagCount} {tagCount > 1 ? 'posts' : 'post'}
        </p>
      </header>

      {/* Posts */}
      {hasPosts && (
        <div className='space-y-3'>
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}

      {!hasPosts && (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant='icon'>
              <HashIcon />
            </EmptyMedia>
            <EmptyTitle>Nenhum post com esta tag</EmptyTitle>
            <EmptyDescription>
              Nenhum post foi publicado com a tag <strong>#{slug}</strong> ainda.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
    </div>
  )
}
