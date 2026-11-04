import {
  ArrowLeftIcon,
  CalendarIcon,
  FolderXIcon,
  LayersIcon,
} from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Icon } from '@/components/icon';
import { PostCard } from '@/components/post-card';
import { Separator } from '@/components/separator';
import { Badge } from '@/components/ui/badge';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { getSeriesPosts } from '@/lib/blog/posts';
import { getAllSeries, getSeriesBySlug } from '@/lib/blog/series';
import {
  OG_LOCALE,
  SERIES_STATUS_LABEL,
  SITE_NAME,
  SeriesStatus,
  TWITTER_HANDLE,
} from '@/lib/constants';
import { formatDate } from '@/lib/format';

import type { Metadata } from 'next';

export const dynamicParams = false;

const statusColor = {
  [SeriesStatus.PLANNED]:
    'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
  [SeriesStatus.IN_PROGRESS]:
    'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  [SeriesStatus.COMPLETE]:
    'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400',
} as const satisfies Record<SeriesStatus, string>;

export async function generateMetadata({
  params,
}: PageProps<'/series/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const series = getSeriesBySlug(slug);

  if (!series) notFound();

  return {
    title: series.title,
    description: series.description,
    alternates: { canonical: `/series/${slug}` },
    openGraph: {
      type: 'website',
      url: `/series/${slug}`,
      locale: OG_LOCALE,
      siteName: SITE_NAME,
      title: series.title,
      description: series.description,
    },
    twitter: {
      card: 'summary_large_image',
      title: series.title,
      description: series.description,
      site: TWITTER_HANDLE,
      creator: TWITTER_HANDLE,
    },
  };
}

export function generateStaticParams() {
  return getAllSeries().map(({ slug }) => ({ slug }));
}

export default async function SeriesDetailPage({
  params,
}: PageProps<'/series/[slug]'>) {
  const { slug } = await params;
  const series = getSeriesBySlug(slug);

  if (!series) notFound();

  const posts = getSeriesPosts(slug);
  const hasPosts = posts.length > 0;
  const postCount = posts.length;

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
            className={`shrink-0 rounded-full text-xs ${statusColor[series.status]}`}
          >
            {SERIES_STATUS_LABEL[series.status]}
          </Badge>
        </div>

        <p className='text-zinc-600 dark:text-zinc-400'>{series.description}</p>

        <div className='mt-3 flex items-center gap-4 text-sm text-zinc-500 dark:text-zinc-500'>
          <span className='flex items-center gap-1.5'>
            <Icon iconNode={LayersIcon} className='size-3.5' />
            {postCount} {postCount === 1 ? 'post' : 'posts'} nesta série
          </span>

          <span className='flex items-center gap-1.5'>
            <Icon iconNode={CalendarIcon} className='size-3.5' />
            <time dateTime={series.publishedAt}>
              {formatDate(series.publishedAt, { dateStyle: 'long' })}
            </time>
          </span>
        </div>
      </header>

      <Separator />

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
              <FolderXIcon />
            </EmptyMedia>

            <EmptyTitle>Nenhum post nesta série</EmptyTitle>

            <EmptyDescription>
              Os posts desta série aparecerão aqui quando forem publicados.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
    </div>
  );
}
