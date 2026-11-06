import { cn } from 'cn';

import { RICH_TEXT_CLASSES } from './rich-text';

import type { ComponentProps } from 'react';

export function Steps({ className, children, ...props }: ComponentProps<'ol'>) {
  return (
    <ol
      className={cn(
        'not-prose list-none',
        '[counter-reset:step]',
        '[&_.step]:relative [&_.step]:border-l [&_.step]:border-border [&_.step]:pb-8 [&_.step]:pl-8 [&_.step:last-child]:pb-0',
        '[&_.step]:before:absolute [&_.step]:before:-left-4 [&_.step]:before:flex [&_.step]:before:size-8',
        '[&_.step]:before:items-center [&_.step]:before:justify-center [&_.step]:before:rounded-full',
        '[&_.step]:before:border [&_.step]:before:border-border [&_.step]:before:bg-background',
        '[&_.step]:before:text-sm [&_.step]:before:font-semibold [&_.step]:before:text-muted-foreground',
        '[&_.step]:[counter-increment:step] [&_.step]:before:[content:counter(step)]',
        '[&_.step-title]:mb-2 [&_.step-title]:font-semibold [&_.step-title]:text-foreground',
        '[&_.step>div]:text-sm [&_.step>div]:text-muted-foreground',
        '[&_.step_figure]:my-3!',
        '[&_.step_a]:underline',
        className,
      )}
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
    <li className={cn('step', className)} {...props}>
      <p className='step-title'>{title}</p>
      <div className={RICH_TEXT_CLASSES}>{children}</div>
    </li>
  );
}
