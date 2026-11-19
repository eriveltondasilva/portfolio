import { cn } from 'cn';

import type { ComponentProps } from 'react';

export type CardHeadingLevel = 'h2' | 'h3';

export function ContentCard({ className, ...props }: ComponentProps<'article'>) {
  return (
    <article
      className={cn(
        'flex flex-col rounded-md border bg-background p-5 transition-colors hover:border-border-strong hover:bg-muted/40',
        className,
      )}
      {...props}
    />
  );
}
