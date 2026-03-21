import {
  ArrowLeftIcon,
  CalendarIcon,
  ClockIcon,
  LayersIcon,
} from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Icon } from '@/components/icon'
import { Separator } from '@/components/ui/separator'
import { formatDate } from '@/lib'
import { getAllPosts, getPostWithContent } from '@/lib/posts'

import { Badge } from '../../../components/ui/badge'

import type { Metadata } from 'next'

export const dynamicParams = false

export async function generateMetadata({
  params,
}: PageProps<'/blog/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostWithContent(slug)

  if (!post) return {}

  return {
    title: post.meta.title,
    description: post.meta.description,
  }
}

export function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export default async function PostPage({ params }: PageProps<'/blog/[slug]'>) {
  const { slug } = await params
  const post = await getPostWithContent(slug)

  if (!post) return notFound()

  const { meta, Content } = post

  return (
    <div>
      {/* Back link */}
      <Link
        href='/blog'
        className='mb-6 inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
      >
        <Icon iconNode={ArrowLeftIcon} />
        Voltar ao blog
      </Link>

      {/* Post header */}
      <header className='mb-8 space-y-4'>
        {/* Series badge */}
        {meta.series && (
          <Link
            href={`/series/${meta.series}`}
            className='inline-flex items-center gap-1.5 text-xs font-medium text-orange-600 hover:underline dark:text-orange-400'
          >
            <Icon iconNode={LayersIcon} className='size-3.5' />
            Parte {meta.order} da série
          </Link>
        )}

        <h1 className='text-3xl leading-tight font-bold tracking-tight text-zinc-900 dark:text-zinc-50'>
          {meta.title}
        </h1>

        <p className='text-lg leading-relaxed text-zinc-600 dark:text-zinc-400'>
          {meta.description}
        </p>

        {/* Meta info */}
        <div className='flex flex-wrap items-center gap-4 text-sm text-zinc-500 dark:text-zinc-500'>
          <span className='flex items-center gap-1.5'>
            <Icon iconNode={CalendarIcon} />
            {formatDate(meta.publishedAt, { dateStyle: 'long' })}
          </span>

          {post.meta.readingTime && (
            <span className='flex items-center gap-1.5'>
              <Icon iconNode={ClockIcon} />
              {post.meta.readingTime} min de leitura
            </span>
          )}
        </div>

        {/* Tags */}
        {meta.tags.length > 0 && (
          <div className='flex flex-wrap gap-1.5'>
            {meta.tags.map((tag) => (
              <Link key={tag} href={`/tags/${tag}`}>
                <Badge
                  variant='secondary'
                  className='rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs text-zinc-600 hover:bg-blue-50 hover:text-blue-700 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-blue-900/30 dark:hover:text-blue-300'
                >
                  {tag}
                </Badge>
              </Link>
            ))}
          </div>
        )}
      </header>

      <Separator className='mb-8 dark:bg-zinc-700/60' />

      {/* Article content */}
      <article className='prose max-w-none prose-zinc dark:prose-invert'>
        <Content />
      </article>

      {/* Footer */}
      <Separator className='my-8 dark:bg-zinc-700/60' />

      <div className='flex justify-between text-sm'>
        <Link
          href='/blog'
          className='flex items-center gap-1.5 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
        >
          <Icon iconNode={ArrowLeftIcon} />
          Todos os posts
        </Link>
      </div>
    </div>
  )
}
