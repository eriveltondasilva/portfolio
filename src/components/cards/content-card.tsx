import { cn } from 'cn';

import type { ComponentProps } from 'react';

export type CardHeadingLevel = 'h2' | 'h3';

export function ContentCard({
  className,
  ...props
}: ComponentProps<'article'>) {
  return (
    <article
      className={cn(
        'flex flex-col rounded-md border bg-background p-5 transition-colors hover:border-zinc-300 hover:bg-zinc-50/50 dark:hover:border-zinc-600 dark:hover:bg-zinc-800/30',
        className,
      )}
      {...props}
    />
  );
}
