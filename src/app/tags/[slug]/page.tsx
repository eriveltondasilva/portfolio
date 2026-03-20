import { ArrowLeft, Hash } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { PostCard } from '@/components/post-card'
import { getAllPosts, getAllTags } from '@/lib/posts'

import type { Metadata } from 'next'

export const dynamicParams = false

export function generateStaticParams() {
  return getAllTags().map((tag) => ({ slug: tag }))
}

export async function generateMetadata({
  params,
}: PageProps<'/tags/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  return {
    title: `#${slug}`,
    description: `Posts sobre ${slug}.`,
  }
}

export default async function TagPage({ params }: PageProps<'/tags/[slug]'>) {
  const { slug } = await params
  const allTags = getAllTags()

  if (!allTags.includes(slug)) return notFound()

  const posts = getAllPosts().filter((post) => post.tags.includes(slug))

  return (
    <div className='space-y-6'>
      {/* Back link */}
      <Link
        href='/tags'
        className='inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
      >
        <ArrowLeft className='h-4 w-4' />
        Todas as tags
      </Link>

      {/* Header */}
      <header className='space-y-1 border-b border-zinc-100 pb-4 dark:border-zinc-800'>
        <h1 className='flex items-center gap-2 text-xl font-bold text-zinc-900 dark:text-zinc-50'>
          <Hash className='h-5 w-5 text-zinc-400' />
          {slug}
        </h1>
        <p className='text-sm text-zinc-500 dark:text-zinc-400'>
          {posts.length} {posts.length === 1 ? 'post' : 'posts'}
        </p>
      </header>

      {/* Posts */}
      {posts.length > 0 ?
        <div className='space-y-3'>
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      : <div className='py-16 text-center'>
          <p className='text-sm text-zinc-500 dark:text-zinc-400'>
            Nenhum post com esta tag.
          </p>
        </div>
      }
    </div>
  )
}
