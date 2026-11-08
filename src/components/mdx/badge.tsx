import { cn } from '@/lib/utils';

import type { ComponentProps } from 'react';

// ─────────────────────────────────────

const variantClasses = {
  default: 'border-border bg-muted text-muted-foreground',
  primary: 'border-primary/50 bg-primary/10 text-primary',
  success:
    'border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-400',
  warning:
    'border-amber-500/50 bg-amber-500/10 text-amber-700 dark:text-amber-400',
  danger: 'border-red-500/50 bg-red-500/10 text-red-700 dark:text-red-400',
  info: 'border-blue-500/50 bg-blue-500/10 text-blue-700 dark:text-blue-400',
} as const;

const sizeClasses = {
  sm: 'px-1 py-px text-[10px]',
  md: 'px-1.5 py-0.5 text-xs',
  lg: 'px-2 py-1 text-sm',
} as const;

// ─────────────────────────────────────

interface Props extends ComponentProps<'span'> {
  variant?: keyof typeof variantClasses;
  size?: keyof typeof sizeClasses;
  dashed?: boolean;
  borderless?: boolean;
}

export function Badge({
  variant = 'default',
  size = 'md',
  dashed = false,
  borderless = false,
  className,
  ...props
}: Props) {
  return (
    <span
      className={cn(
        'not-prose inline-flex items-center rounded-lg border font-mono font-medium transition-colors',
        variantClasses[variant],
        sizeClasses[size],
        dashed && 'border-dashed',
        // ! Must come after the variant classes so `border-transparent` wins over the variant's border color.
        borderless && 'border-transparent',
        className,
      )}
      {...props}
    />
  );
}
