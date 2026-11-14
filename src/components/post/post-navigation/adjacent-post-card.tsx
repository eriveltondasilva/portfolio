import { cn } from 'cn';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import Link from 'next/link';

import { Icon } from '@/components/icon';

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
      className={cn(
        'group flex min-w-0 flex-col gap-1 rounded-md border p-4 transition-colors hover:border-zinc-300 hover:bg-zinc-50 dark:hover:border-zinc-600 dark:hover:bg-zinc-800/30',
        !isPrev && 'text-right',
        className,
      )}
    >
      <span
        className={cn(
          'flex items-center gap-1.5 text-sm text-muted-foreground uppercase',
          !isPrev && 'justify-end',
        )}
      >
        {isPrev && <Icon iconNode={ChevronLeftIcon} />}
        {isPrev ? 'Anterior' : 'Próximo'}
        {!isPrev && <Icon iconNode={ChevronRightIcon} />}
      </span>

      <span className='line-clamp-2 text-sm font-medium text-foreground/80 transition-colors group-hover:text-zinc-900 dark:group-hover:text-zinc-50'>
        {post.title}
      </span>
    </Link>
  );
}
