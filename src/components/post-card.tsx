import { DotIcon, FileTextIcon } from 'lucide-react';
import Link from 'next/link';

import { formatDate } from '@/lib/format';
import { cn } from '@/lib/utils';

import { Icon } from './icon';

import type { PostIndex } from '@/types';
import type { ComponentPropsWithoutRef } from 'react';
import { TagLink } from './tag-link';

interface Props extends ComponentPropsWithoutRef<'article'> {
  post: PostIndex;
}

export function PostCard({ post, ...props }: Props) {
  return (
    <article
      className={cn(
        'group flex flex-col rounded-md border border-zinc-200 bg-white p-5 transition-colors hover:border-zinc-300 hover:bg-zinc-50/50 dark:border-zinc-700/60 dark:bg-zinc-900/30 dark:hover:border-zinc-600 dark:hover:bg-zinc-800/30',
        props.className,
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
      <div className='flex items-start justify-between gap-4'>
        <div className='flex items-center gap-2 text-blue-500 dark:text-blue-400'>
          <Icon iconNode={FileTextIcon} />
          <Link
            href={`/blog/${post.slug}`}
            className='font-semibold text-balance hover:underline'
          >
            {post.title}
          </Link>
        </div>
      </div>

      {/* Description */}
      <p className='mt-2 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400'>
        {post.description}
      </p>

      {/* Meta */}
      <div className='mt-2 flex items-center text-xs text-zinc-500 dark:text-zinc-500'>
        <span>
          {post.updatedAt ? 'Atualizado em ' : 'Publicado em '}
          <time dateTime={post.updatedAt ?? post.publishedAt}>
            {formatDate(post.updatedAt ?? post.publishedAt)}
          </time>
        </span>

        <Icon iconNode={DotIcon} />

        <span>{post.readingTime} min de leitura</span>
      </div>
    </article>
  );
}
