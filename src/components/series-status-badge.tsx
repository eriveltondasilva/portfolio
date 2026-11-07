import { SERIES_STATUS_LABEL, SeriesStatus } from '@/lib/constants';
import { cn } from '@/lib/utils';

import { Badge } from './ui/badge';

interface Props {
  status: SeriesStatus;
  size?: 'sm' | 'lg';
  className?: string;
}

const statusStyle = {
  [SeriesStatus.PLANNED]: {
    badge: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
    dot: 'bg-zinc-400',
  },
  [SeriesStatus.IN_PROGRESS]: {
    badge:
      'bg-amber-600/10 text-amber-700 dark:bg-amber-400/10 dark:text-amber-400',
    dot: 'bg-amber-500',
  },
  [SeriesStatus.COMPLETE]: {
    badge:
      'bg-green-600/10 text-green-700 dark:bg-green-400/10 dark:text-green-400',
    dot: 'bg-green-500',
  },
} as const satisfies Record<SeriesStatus, { badge: string; dot: string }>;

const sizeStyle = {
  sm: { badge: 'text-xs', dot: 'size-1.5' },
  lg: { badge: 'gap-2 px-3 py-1 text-sm', dot: 'size-2' },
} as const;

export function SeriesStatusBadge({ status, size = 'sm', className }: Props) {
  const color = statusStyle[status];
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
      {SERIES_STATUS_LABEL[status]}
    </Badge>
  );
}
