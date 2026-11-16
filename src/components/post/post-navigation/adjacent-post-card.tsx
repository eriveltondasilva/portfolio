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
        'group flex min-w-0 flex-col gap-1 rounded-md border p-4 transition-colors hover:border-border-strong hover:bg-muted/40',
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

      <span className='line-clamp-2 text-sm font-medium text-foreground/80 transition-colors group-hover:text-foreground'>
        {post.title}
      </span>
    </Link>
  );
}
