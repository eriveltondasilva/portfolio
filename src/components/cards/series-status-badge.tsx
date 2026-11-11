import { SERIES_STATUS_LABEL, SeriesStatus } from '@/lib/constants';

import { StatusBadge } from './status-badge';

import type { StatusTone } from './status-badge';
import type { ComponentProps } from 'react';

interface Props extends Omit<
  ComponentProps<typeof StatusBadge>,
  'label' | 'tone'
> {
  status: SeriesStatus;
}

const statusTone = {
  [SeriesStatus.PLANNED]: 'neutral',
  [SeriesStatus.IN_PROGRESS]: 'warning',
  [SeriesStatus.COMPLETE]: 'success',
} as const satisfies Record<SeriesStatus, StatusTone>;

export function SeriesStatusBadge({ status, ...props }: Props) {
  return (
    <StatusBadge
      label={SERIES_STATUS_LABEL[status]}
      tone={statusTone[status]}
      {...props}
    />
  );
}
