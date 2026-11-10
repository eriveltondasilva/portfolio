import { ExternalLinkIcon, FolderGit2Icon, StarIcon } from 'lucide-react';
import Image from 'next/image';
import { cn } from 'cn';

import GithubIcon from '@/assets/github.svg';
import { Badge } from '@/components/ui/badge';
import { ProjectStatus } from '@/lib/constants';

import { Icon } from './icon';

import type { ComponentPropsWithoutRef } from 'react';
import type { Project } from '@/types';

interface Props extends ComponentPropsWithoutRef<'article'> {
  project: Project;
  className?: string;
}

interface BadgeProps {
  label: string;
  className: string;
  dot: string;
}

const statusConfig: Record<ProjectStatus, BadgeProps> = {
  [ProjectStatus.ARCHIVED]: {
    label: 'Arquivado',
    dot: 'bg-primary size-1.5 rounded-full',
    className: 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400',
  },
  [ProjectStatus.WIP]: {
    label: 'Em progresso',
    dot: 'size-1.5 rounded-full bg-amber-500',
    className:
      'border-none bg-amber-600/10 text-amber-600 dark:bg-amber-400/10 dark:text-amber-400',
  },
  [ProjectStatus.ACTIVE]: {
    label: 'Ativo',
    dot: 'size-1.5 rounded-full bg-green-500',
    className:
      'border-none bg-green-600/10 text-green-600 dark:bg-green-400/10 dark:text-green-400',
  },
};

export function ProjectCard({ project, className, ...props }: Props) {
  const status = statusConfig[project.status];

  return (
    <article
      className={cn(
        'group flex flex-col rounded-md border border-zinc-200 bg-white p-5 transition-colors hover:border-zinc-300 hover:bg-zinc-50/50 dark:border-zinc-700/60 dark:bg-zinc-900/30 dark:hover:border-zinc-600 dark:hover:bg-zinc-800/30',
        className,
      )}
      {...props}
    >
      {/* Header */}
      <div className='flex flex-wrap items-start justify-between gap-x-4 gap-y-2'>
        <div className='flex min-w-0 items-start gap-2'>
          <Icon iconNode={FolderGit2Icon} className='mt-1 shrink-0' />

          <a
            href={project.repository}
            target='_blank'
            rel='noopener noreferrer'
            className='min-w-0 font-semibold wrap-break-word text-blue-600 hover:underline dark:text-blue-400'
          >
            {project.name}
          </a>

          {project.featured && (
            <Icon
              iconNode={StarIcon}
              label='Em destaque'
              className='mt-1.25 size-3.5 shrink-0 fill-amber-400 text-amber-400'
            />
          )}
        </div>

        <Badge className={status.className}>
          <span className={status.dot} aria-hidden='true' />
          {status.label}
        </Badge>
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
          <Image src={GithubIcon} alt='' width={14} height={14} />
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
    </article>
  );
}
