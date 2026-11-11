import { DotIcon, FolderBookmarkIcon } from 'lucide-react';
import Link from 'next/link';
import { cn } from 'cn';

import { Icon } from '@/components/icon';
import { formatDate, formatReadingTime } from '@/lib/format';

import { ContentCard } from './content-card';
import { SeriesStatusBadge } from './series-status-badge';

import type { CardHeadingLevel } from './content-card';
import type { SeriesIndex } from '@/types';
import type { ComponentPropsWithoutRef } from 'react';

const MAX_LISTED_POSTS = 3;

interface SeriesCardProps extends ComponentPropsWithoutRef<'article'> {
  series: SeriesIndex;
  showStatusBadge?: boolean;
  headingLevel?: CardHeadingLevel;
}

export function SeriesCard({
  series,
  showStatusBadge = false,
  headingLevel: Heading = 'h2',
  className,
  ...props
}: SeriesCardProps) {
  const postCount = series.posts.length;

  return (
    <ContentCard className={cn('@container', className)} {...props}>
      {/* Header */}
      <div className='flex flex-wrap items-start justify-between gap-x-4 gap-y-2'>
        <div className='flex min-w-0 items-start gap-2 text-orange-500 dark:text-orange-400'>
          <Icon iconNode={FolderBookmarkIcon} className='mt-1 shrink-0' />

          <Heading className='min-w-0 font-semibold text-balance wrap-break-word'>
            <Link href={`/series/${series.slug}`} className='hover:underline'>
              {series.title}
            </Link>
          </Heading>
        </div>

        {showStatusBadge && <SeriesStatusBadge status={series.status} />}
      </div>

      {/* Description */}
      <p className='mt-1 text-sm text-zinc-600 dark:text-zinc-400'>
        {series.description}
      </p>

      {/* Meta info */}
      <div className='mt-2 flex flex-col gap-0.5 text-xs text-zinc-400 @md:flex-row @md:flex-wrap @md:items-center dark:text-zinc-500'>
        <span>
          Publicada em{' '}
          <time dateTime={series.publishedAt}>
            {formatDate(series.publishedAt, { dateStyle: 'long' })}
          </time>
        </span>

        <Icon iconNode={DotIcon} className='hidden @md:block' />

        <span>
          {postCount} {postCount === 1 ? 'post' : 'posts'} nesta série
        </span>

        {postCount > 0 && (
          <>
            <Icon iconNode={DotIcon} className='hidden @md:block' />
            <span>{formatReadingTime(series.readingTime)} de leitura</span>
          </>
        )}
      </div>

      {/* Posts list */}
      {postCount > 0 && (
        <ol className='mt-3 space-y-1 border-t-2 border-zinc-100 pt-3 dark:border-zinc-700/60'>
          {series.posts.slice(0, MAX_LISTED_POSTS).map((post) => (
            <li key={post.slug} className='flex items-center gap-2'>
              <span className='min-w-5 text-center text-xs text-zinc-400'>
                {post.order}.
              </span>

              <Link
                href={`/blog/${post.slug}`}
                className='truncate text-sm text-zinc-600 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400'
              >
                {post.title}
              </Link>
            </li>
          ))}

          {postCount > MAX_LISTED_POSTS && (
            <li className='pl-6 text-xs text-zinc-400'>
              +{postCount - MAX_LISTED_POSTS} mais
            </li>
          )}
        </ol>
      )}
    </ContentCard>
  );
}
