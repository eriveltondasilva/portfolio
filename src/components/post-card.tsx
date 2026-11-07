import { DotIcon, FileTextIcon } from 'lucide-react';
import Link from 'next/link';

import { formatDate } from '@/lib/format';
import { cn } from '@/lib/utils';

import { Icon } from './icon';
import { TagLink } from './tag-link';

import type { PostIndex } from '@/types';
import type { ComponentPropsWithoutRef } from 'react';

interface Props extends ComponentPropsWithoutRef<'article'> {
  post: PostIndex;
}

export function PostCard({ post, className, ...props }: Props) {
  return (
    <article
      className={cn(
        'group @container flex flex-col rounded-md border border-zinc-200 bg-white p-5 transition-colors hover:border-zinc-300 hover:bg-zinc-50/50 dark:border-zinc-700/60 dark:bg-zinc-900/30 dark:hover:border-zinc-600 dark:hover:bg-zinc-800/30',
        className,
      )}
      {...props}
    >
      {/* Tags */}
      {post.tags.length > 0 && (
        <div className='mb-2 flex flex-wrap gap-1.5'>
          {post.tags.map((tag) => (
            <TagLink key={tag} tag={tag} />
          ))}
        </div>
      )}

      {/* Header */}
      <div className='flex items-start gap-2 text-blue-500 dark:text-blue-400'>
        <Icon iconNode={FileTextIcon} className='mt-1 shrink-0' />

        <Link
          href={`/blog/${post.slug}`}
          className='min-w-0 font-semibold text-balance hover:underline'
        >
          {post.title}
        </Link>
      </div>

      {/* Description */}
      <p className='mt-2 text-sm text-zinc-600 dark:text-zinc-400'>
        {post.description}
      </p>

      {/* Meta */}
      {/* Stacked while the card is narrow; the dot only shows when both items fit on one line */}
      <div className='mt-2 flex flex-col gap-0.5 text-xs text-zinc-400 @sm:flex-row @sm:flex-wrap @sm:items-center dark:text-zinc-500'>
        <span>
          {post.updatedAt ? 'Atualizado em ' : 'Publicado em '}
          <time dateTime={post.updatedAt ?? post.publishedAt}>
            {formatDate(post.updatedAt ?? post.publishedAt, {
              dateStyle: 'long',
            })}
          </time>
        </span>

        <Icon iconNode={DotIcon} className='hidden @md:block' />

        <span>{post.readingTime} min de leitura</span>
      </div>
    </article>
  );
}
