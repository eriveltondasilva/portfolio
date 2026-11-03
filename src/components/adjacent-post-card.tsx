import { clsx } from 'cn';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import Link from 'next/link';

import { Icon } from './icon';

import type { PostIndex } from '@/types';

interface Props {
  post: PostIndex;
  direction: 'prev' | 'next';
  className?: string;
}

export function AdjacentPostCard({ post, direction, className }: Props) {
  const isPrev = direction === 'prev';

  return (
    <Link
      href={`/blog/${post.slug}`}
      className={clsx(
        'group flex min-w-0 flex-col gap-1 rounded-md border border-zinc-200 p-4 transition-colors hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700/60 dark:hover:border-zinc-600 dark:hover:bg-zinc-800/30',
        !isPrev && 'text-right',
        className,
      )}
    >
      <span
        className={clsx(
          'flex items-center gap-1.5 text-sm text-zinc-400 dark:text-zinc-500',
          !isPrev && 'justify-end',
        )}
      >
        {isPrev && <Icon iconNode={ChevronLeftIcon} />}
        {isPrev ? 'ANTERIOR' : 'PRÓXIMO'}
        {!isPrev && <Icon iconNode={ChevronRightIcon} />}
      </span>
      <span
        className={clsx(
          'line-clamp-2 text-sm font-medium text-zinc-700 transition-colors group-hover:text-zinc-900 dark:text-zinc-300 dark:group-hover:text-zinc-50',
          !isPrev && 'text-right',
        )}
      >
        {post.title}
      </span>
    </Link>
  );
}
