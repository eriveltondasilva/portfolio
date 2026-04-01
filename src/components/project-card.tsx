import { ExternalLinkIcon, AArrowDownIcon, StarIcon } from 'lucide-react'

import { Badge } from '#/components/ui/badge'
import { cn } from '#/lib/utils'
import { ProjectStatus } from '#/lib/constants'

import { Icon } from './icon'

import type { Project } from '#/types'

interface Props {
  project: Project
  className?: string
}

interface BadgeProps {
  label: string
  className: string
  dot: string
}

const statusConfig: Record<ProjectStatus, BadgeProps> = {
  [ProjectStatus.ACTIVE]: {
    label: 'Ativo',
    dot: 'size-1.5 rounded-full bg-green-500',
    className:
      'border-none bg-green-600/10 text-green-600 dark:bg-green-400/10 dark:text-green-400',
  },
  [ProjectStatus.WIP]: {
    label: 'Em progresso',
    dot: 'size-1.5 rounded-full bg-amber-500',
    className:
      'border-none bg-amber-600/10 text-amber-600 dark:bg-amber-400/10 dark:text-amber-400',
  },
  [ProjectStatus.ARCHIVED]: {
    label: 'Arquivado',
    dot: 'bg-primary size-1.5 rounded-full',
    className: 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400',
  },
}

export function ProjectCard({ project, className }: Props) {
  const status = statusConfig[project.status]

  return (
    <article
      className={cn(
        'group flex flex-col rounded-md border border-zinc-200 bg-white p-5 transition-colors hover:border-zinc-300 hover:bg-zinc-50/50 dark:border-zinc-700/60 dark:bg-zinc-900/30 dark:hover:border-zinc-600 dark:hover:bg-zinc-800/30',
        className,
      )}
    >
      {/* Header */}
      <div className='flex items-start justify-between gap-4'>
        <div className='flex items-center gap-2'>
          <Icon
            iconNode={AArrowDownIcon}
            className='shrink-0 text-zinc-400 dark:text-zinc-500'
          />
          <a
            href={project.repository}
            target='_blank'
            rel='noopener noreferrer'
            className='font-semibold text-blue-600 hover:underline dark:text-blue-400'
          >
            {project.name}
          </a>
          {project.featured && (
            <Icon
              iconNode={StarIcon}
              className='size-3.5 fill-amber-400 text-amber-400'
            />
          )}
        </div>

        <Badge className={cn('shrink-0 gap-1.5', status.className)}>
          <span className={status.dot} aria-hidden='true' />
          {status.label}
        </Badge>
      </div>

      {/* Description */}
      <p className='mt-2 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400'>
        {project.description}
      </p>

      {/* Tags */}
      {project.tags.length > 0 && (
        <div className='mt-3 flex flex-wrap gap-1.5'>
          {project.tags.map((tag) => (
            <Badge
              key={tag}
              variant='secondary'
              className='rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
            >
              {tag}
            </Badge>
          ))}
        </div>
      )}

      {/* Footer links */}
      <div className='mt-4 flex items-center gap-4 text-xs'>
        <a
          href={project.repository}
          target='_blank'
          rel='noopener noreferrer'
          className='flex items-center gap-1 text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
        >
          <Icon iconNode={AArrowDownIcon} className='size-3.5' />
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
  )
}
