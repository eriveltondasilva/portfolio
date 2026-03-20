import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { PostCard } from '@/components/post-card'
import { Separator } from '@/components/ui/separator'
import { getAllPosts, getAllSeries, getSeriesBySlug } from '@/lib/posts'
import { SeriesStatus } from '@/types'
import { Badge } from '@/components/ui/badge'

import type { Metadata } from 'next'

export const dynamicParams = false

export function generateStaticParams() {
  return getAllSeries().map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({
  params,
}: PageProps<'/series/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  const series = getSeriesBySlug(slug)
  if (!series) return {}
  return { title: series.title, description: series.description }
}

const statusLabels: Record<SeriesStatus, string> = {
  [SeriesStatus.PLANNED]: 'Planejada',
  [SeriesStatus.IN_PROGRESS]: 'Em andamento',
  [SeriesStatus.COMPLETE]: 'Completa',
}

const statusColors: Record<SeriesStatus, string> = {
  [SeriesStatus.PLANNED]:
    'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
  [SeriesStatus.IN_PROGRESS]:
    'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  [SeriesStatus.COMPLETE]:
    'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400',
}

export default async function SeriesDetailPage({
  params,
}: PageProps<'/series/[slug]'>) {
  const { slug } = await params
  const series = getSeriesBySlug(slug)

  if (!series) return notFound()

  const allPosts = getAllPosts()
  const seriesPosts = allPosts
    .filter((post) => post.series === slug)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))

  const statusKey = series.status as SeriesStatus

  return (
    <div className='space-y-6'>
      {/* Back link */}
      <Link
        href='/series'
        className='inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
      >
        <ArrowLeft className='h-4 w-4' />
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
            className={`shrink-0 rounded-full text-xs ${statusColors[statusKey]}`}
          >
            {statusLabels[statusKey]}
          </Badge>
        </div>
        <p className='text-zinc-600 dark:text-zinc-400'>{series.description}</p>
        <p className='text-sm text-zinc-500 dark:text-zinc-500'>
          {seriesPosts.length} {seriesPosts.length === 1 ? 'post' : 'posts'}{' '}
          nesta série
        </p>
      </header>

      <Separator className='dark:bg-zinc-700/60' />

      {/* Posts */}
      {seriesPosts.length > 0 ?
        <div className='space-y-3'>
          {seriesPosts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      : <div className='py-16 text-center'>
          <p className='text-sm text-zinc-500 dark:text-zinc-400'>
            Nenhum post nesta série ainda.
          </p>
        </div>
      }
    </div>
  )
}
