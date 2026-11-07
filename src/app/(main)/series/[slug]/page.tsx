import {
  ArrowLeftIcon,
  CalendarIcon,
  ClockIcon,
  FolderXIcon,
  LayersIcon,
} from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Icon } from '@/components/icon';
import { PostCard } from '@/components/post-card';
import { Separator } from '@/components/separator';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { getSeriesPosts } from '@/lib/blog/posts';
import { getAllSeries, getSeriesBySlug } from '@/lib/blog/series';
import { OG_LOCALE, SITE_NAME, TWITTER_HANDLE } from '@/lib/constants';
import { formatDate, formatReadingTime } from '@/lib/format';
import { SeriesStatusBadge } from '@/components/series-status-badge';

import type { Metadata } from 'next';

export const dynamicParams = false;

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
  const postCount = posts.length;
  const hasPosts = postCount > 0;

  const totalReadingTime = posts.reduce(
    (total, post) => total + post.readingTime,
    0,
  );

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
        <SeriesStatusBadge status={series.status} size='lg' />

        <h1 className='font-mono text-3xl leading-tight font-bold tracking-tight text-balance text-zinc-900 sm:text-4xl dark:text-zinc-50'>
          {series.title}
        </h1>

        <p className='text-zinc-600 dark:text-zinc-400'>{series.description}</p>

        <div className='mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-zinc-500 dark:text-zinc-500'>
          <span className='flex items-center gap-1.5'>
            <Icon iconNode={LayersIcon} className='size-3.5' />
            {postCount} {postCount === 1 ? 'post' : 'posts'} nesta série
          </span>

          {hasPosts && (
            <span className='flex items-center gap-1.5'>
              <Icon iconNode={ClockIcon} className='size-3.5' />
              {formatReadingTime(totalReadingTime)} de leitura
            </span>
          )}

          <span className='flex items-center gap-1.5'>
            <Icon iconNode={CalendarIcon} className='size-3.5' />
            <span>
              Publicada em&nbsp;
              <time dateTime={series.publishedAt}>
                {formatDate(series.publishedAt, { dateStyle: 'long' })}
              </time>
            </span>
          </span>
        </div>
      </header>

      <Separator />

      {/* Posts list */}
      {hasPosts && (
        <ol className='space-y-3'>
          {posts.map((post) => (
            <li key={post.slug} className='flex items-start gap-3'>
              <span className='mt-5 w-6 shrink-0 text-right font-mono text-sm text-zinc-400 tabular-nums dark:text-zinc-500'>
                {post.order}.
              </span>
              <PostCard post={post} className='min-w-0 flex-1' />
            </li>
          ))}
        </ol>
      )}

      {/* Empty state */}
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
