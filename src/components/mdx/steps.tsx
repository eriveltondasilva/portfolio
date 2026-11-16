import { cn } from 'cn';

import { PROSE_RESET_CLASSES } from './prose';

import type { ComponentProps } from 'react';

// ─────────────────────────────────────

export function Steps({ className, children, ...props }: ComponentProps<'ol'>) {
  return (
    <ol
      className={cn('not-prose list-none [counter-reset:step]', className)}
      {...props}
    >
      {children}
    </ol>
  );
}

// ─────────────────────────────────────

interface StepProps extends ComponentProps<'li'> {
  title: string;
}

export function Step({ title, className, children, ...props }: StepProps) {
  return (
    <li
      className={cn(
        'relative border-l border-border pb-8 pl-8 [counter-increment:step] last:pb-0',
        'before:absolute before:-left-4 before:flex before:size-8 before:items-center before:justify-center',
        'before:rounded-full before:border before:border-border before:bg-background',
        'before:text-sm before:font-semibold before:text-muted-foreground before:content-[counter(step)]',
        className,
      )}
      {...props}
    >
      <p className='mb-2 font-semibold text-foreground'>{title}</p>

      <div
        className={cn(
          'text-sm text-muted-foreground [&_a]:underline [&_figure]:my-3!',
          PROSE_RESET_CLASSES,
        )}
      >
        {children}
      </div>
    </li>
  );
}
