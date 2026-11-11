import { cn } from 'cn';

import { Badge } from '@/components/ui/badge';

const toneStyle = {
  neutral: {
    badge: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
    dot: 'bg-zinc-400',
  },
  warning: {
    badge:
      'bg-amber-600/10 text-amber-700 dark:bg-amber-400/10 dark:text-amber-400',
    dot: 'bg-amber-500',
  },
  success: {
    badge:
      'bg-green-600/10 text-green-700 dark:bg-green-400/10 dark:text-green-400',
    dot: 'bg-green-500',
  },
} as const;

const sizeStyle = {
  sm: { badge: 'text-xs', dot: 'size-1.5' },
  lg: { badge: 'gap-2 px-3 py-1 text-sm', dot: 'size-2' },
} as const;

export type StatusTone = keyof typeof toneStyle;

interface Props {
  label: string;
  tone: StatusTone;
  size?: keyof typeof sizeStyle;
  className?: string;
}

export function StatusBadge({ label, tone, size = 'sm', className }: Props) {
  const color = toneStyle[tone];
  const dimension = sizeStyle[size];

  return (
    <Badge
      variant='secondary'
      className={cn(
        'rounded-full border-none',
        color.badge,
        dimension.badge,
        className,
      )}
    >
      <span
        className={cn('rounded-full', color.dot, dimension.dot)}
        aria-hidden='true'
      />
      {label}
    </Badge>
  );
}
