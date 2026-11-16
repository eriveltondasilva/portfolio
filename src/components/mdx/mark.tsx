import { cn } from 'cn';

import { tw } from '@/lib/tw';

import type { ComponentProps } from 'react';

// ─────────────────────────────────────

const variantClasses = {
  default: tw`bg-amber-300/40 dark:bg-amber-400/25`,
  success: tw`bg-green-500/25 dark:bg-green-400/25`,
  info: tw`bg-blue-500/25 dark:bg-blue-400/25`,
  danger: tw`bg-red-500/25 dark:bg-red-400/25`,
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
