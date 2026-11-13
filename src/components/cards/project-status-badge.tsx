import { ProjectStatus } from '@/lib/constants';

import { StatusBadge } from './status-badge';

import type { StatusTone } from './status-badge';

const statusBadge = {
  [ProjectStatus.ARCHIVED]: { label: 'Arquivado', tone: 'neutral' },
  [ProjectStatus.WIP]: { label: 'Em progresso', tone: 'warning' },
  [ProjectStatus.ACTIVE]: { label: 'Ativo', tone: 'success' },
} as const satisfies Record<ProjectStatus, { label: string; tone: StatusTone }>;

export function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  return <StatusBadge {...statusBadge[status]} />;
}
