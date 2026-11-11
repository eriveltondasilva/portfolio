import { ExternalLinkIcon, FolderGit2Icon, StarIcon } from 'lucide-react';
import Image from 'next/image';

import GithubIcon from '@/assets/github.svg';
import { Icon } from '@/components/icon';
import { Badge } from '@/components/ui/badge';
import { ProjectStatus } from '@/lib/constants';

import { ContentCard } from './content-card';
import { StatusBadge } from './status-badge';

import type { CardHeadingLevel } from './content-card';
import type { StatusTone } from './status-badge';
import type { ComponentPropsWithoutRef } from 'react';
import type { Project } from '@/types';

interface Props extends ComponentPropsWithoutRef<'article'> {
  project: Project;
  headingLevel?: CardHeadingLevel;
}

const statusBadge = {
  [ProjectStatus.ARCHIVED]: { label: 'Arquivado', tone: 'neutral' },
  [ProjectStatus.WIP]: { label: 'Em progresso', tone: 'warning' },
  [ProjectStatus.ACTIVE]: { label: 'Ativo', tone: 'success' },
} as const satisfies Record<ProjectStatus, { label: string; tone: StatusTone }>;

export function ProjectCard({
  project,
  headingLevel: Heading = 'h2',
  ...props
}: Props) {
  return (
    <ContentCard {...props}>
      {/* Header */}
      <div className='flex flex-wrap items-start justify-between gap-x-4 gap-y-2'>
        <div className='flex min-w-0 items-start gap-2'>
          <Icon iconNode={FolderGit2Icon} className='mt-1 shrink-0' />

          <Heading className='min-w-0 font-semibold wrap-break-word text-zinc-900 dark:text-zinc-50'>
            {project.name}
          </Heading>

          {project.featured && (
            <Icon
              iconNode={StarIcon}
              label='Em destaque'
              className='mt-1.25 size-3.5 shrink-0 fill-amber-400 text-amber-400'
            />
          )}
        </div>

        <StatusBadge {...statusBadge[project.status]} />
      </div>

      {/* Description */}
      <p className='mt-2 text-sm text-zinc-600 dark:text-zinc-400'>
        {project.description}
      </p>

      {/* Tags */}
      {project.tags.length > 0 && (
        <div className='mt-2 flex flex-wrap gap-1.5'>
          {project.tags.map((tag) => (
            <Badge
              key={tag}
              variant='outline'
              className='rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
            >
              {tag}
            </Badge>
          ))}
        </div>
      )}

      {/* Footer links */}
      <div className='mt-4 flex flex-wrap items-center gap-4 text-xs'>
        <a
          href={project.repository}
          target='_blank'
          rel='noopener noreferrer'
          className='flex items-center gap-1 text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
        >
          <Image
            src={GithubIcon}
            alt=''
            width={14}
            height={14}
            className='dark:invert'
          />
          Repositório
        </a>

        {project.url && (
          <a
            href={project.url}
            target='_blank'
            rel='noopener noreferrer'
            className='flex items-center gap-1 text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
          >
            <Icon iconNode={ExternalLinkIcon} className='size-3.5' />
            Ver projeto
          </a>
        )}
      </div>
    </ContentCard>
  );
}
