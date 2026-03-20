import { ArrowLeft, Calendar, Clock, Layers } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Separator } from '@/components/ui/separator'
import { getAllPosts, getPostWithContent } from '@/lib/posts'

import { Badge } from '../../../components/ui/badge'

import type { Metadata } from 'next'

export const dynamicParams = false

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }))
}

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

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

export default async function PostPage({ params }: PageProps<'/blog/[slug]'>) {
  const { slug } = await params
  const post = await getPostWithContent(slug)

  if (!post) return notFound()

  const { meta, Content } = post

  return (
    <div className='mx-auto max-w-3xl'>
      {/* Back link */}
      <Link
        href='/blog'
        className='mb-6 inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
      >
        <ArrowLeft className='h-4 w-4' />
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
            <Layers className='h-3.5 w-3.5' />
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
            <Calendar className='h-4 w-4' />
            {formatDate(meta.publishedAt)}
          </span>
          {post.meta.readingTime && (
            <span className='flex items-center gap-1.5'>
              <Clock className='h-4 w-4' />
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
      <article className='prose max-w-none prose-zinc dark:prose-invert prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline dark:prose-a:text-blue-400 prose-code:rounded prose-code:bg-zinc-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:font-mono prose-code:text-sm prose-code:before:content-none prose-code:after:content-none dark:prose-code:bg-zinc-800'>
        <Content />
      </article>

      {/* Footer */}
      <Separator className='my-8 dark:bg-zinc-700/60' />
      <div className='flex justify-between text-sm'>
        <Link
          href='/blog'
          className='flex items-center gap-1.5 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
        >
          <ArrowLeft className='h-4 w-4' />
          Todos os posts
        </Link>
      </div>
    </div>
  )
}
