import { ArrowLeftIcon } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Icon } from '#/components/icon'
import { PostCard } from '#/components/post-card'
import { Badge } from '#/components/ui/badge'
import { Separator } from '#/components/ui/separator'
import { getPostsBySeries } from '#/lib/blog/posts'
import { getAllSeries, getSeriesBySlug } from '#/lib/blog/series'
import { SeriesStatus } from '#/lib/constants'

import type { Metadata } from 'next'

export const dynamicParams = false

const statusMap = {
  [SeriesStatus.PLANNED]: {
    label: 'Planejada',
    color: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
  },
  [SeriesStatus.IN_PROGRESS]: {
    label: 'Em andamento',
    color:
      'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  },
  [SeriesStatus.COMPLETE]: {
    label: 'Completa',
    color:
      'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  },
}

export async function generateMetadata({
  params,
}: PageProps<'/series/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  const series = getSeriesBySlug(slug)

  if (!series) return {}

  return {
    title: series.title,
    description: series.description,
    openGraph: {
      type: 'website',
      url: `/series/${slug}`,
      title: series.title,
      description: series.description,
    },
  }
}

export function generateStaticParams() {
  const series = getAllSeries()
  return series.map(({ slug }) => ({ slug }))
}

export default async function SeriesDetailPage({
  params,
}: PageProps<'/series/[slug]'>) {
  const { slug } = await params
  const series = getSeriesBySlug(slug)

  if (!series) return notFound()

  const posts = getPostsBySeries(slug)
  const hasPosts = posts.length > 0
  const status = statusMap[series.status]

  return (
    <div className='space-y-6'>
      {/* Back link */}
      <Link
        href='/series'
        className='inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
      >
        <Icon iconNode={ArrowLeftIcon} />
        Todas as séries
      </Link>

      {/* Series header */}
      <header className='space-y-3'>
        <div className='flex items-start justify-between gap-4'>
          <h1 className='text-2xl leading-tight font-bold text-zinc-900 dark:text-zinc-50'>
            {series.title}
          </h1>
          <Badge
            variant='secondary'
            className={`shrink-0 rounded-full text-xs ${status.color}`}
          >
            {status.label}
          </Badge>
        </div>
        <p className='text-zinc-600 dark:text-zinc-400'>{series.description}</p>
        <p className='text-sm text-zinc-500 dark:text-zinc-500'>
          {posts.length} {posts.length === 1 ? 'post' : 'posts'} nesta série
        </p>
      </header>

      <Separator className='dark:bg-zinc-700/60' />

      {/* Posts */}
      {hasPosts && (
        <div className='space-y-3'>
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}

      {!hasPosts && (
        <div className='py-16 text-center'>
          <p className='text-sm text-zinc-500 dark:text-zinc-400'>
            Nenhum post nesta série ainda.
          </p>
        </div>
      )}
    </div>
  )
}
