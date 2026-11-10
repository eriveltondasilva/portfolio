import { cn } from 'cn';

import type { ComponentProps } from 'react';

// ─────────────────────────────────────

const variantClasses = {
  default: 'bg-amber-300/40 dark:bg-amber-400/25',
  success: 'bg-green-500/25 dark:bg-green-400/25',
  info: 'bg-blue-500/25 dark:bg-blue-400/25',
  danger: 'bg-red-500/25 dark:bg-red-400/25',
} as const;

// ─────────────────────────────────────

interface Props extends ComponentProps<'mark'> {
  variant?: keyof typeof variantClasses;
}

export function Mark({ variant = 'default', className, ...props }: Props) {
  return (
    <mark
      className={cn(
        'rounded-sm box-decoration-clone px-1 py-0.5 text-foreground',
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}
