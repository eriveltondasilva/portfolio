import { ExternalLinkIcon, FolderGit2Icon, StarIcon } from 'lucide-react';
import Image from 'next/image';

import GithubIcon from '@/assets/github.svg';
import { Icon } from '@/components/icon';
import { Badge } from '@/components/ui/badge';

import { ContentCard } from './content-card';
import { ProjectStatusBadge } from './project-status-badge';

import type { CardHeadingLevel } from './content-card';
import type { ComponentProps } from 'react';
import type { Project } from '@/types';

interface Props extends ComponentProps<'article'> {
  project: Project;
  headingLevel?: CardHeadingLevel;
}

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

          <Heading className='min-w-0 font-semibold text-balance wrap-break-word text-foreground'>
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

        <ProjectStatusBadge status={project.status} />
      </div>

      {/* Description */}
      <p className='mt-2 text-sm text-muted-foreground'>
        {project.description}
      </p>

      {/* Tags */}
      {project.tags.length > 0 && (
        <div className='mt-2 flex flex-wrap gap-1.5'>
          {project.tags.map((tag) => (
            <Badge
              key={tag}
              variant='outline'
              className='rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-muted-foreground dark:bg-zinc-800'
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
          className='flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground'
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
            className='flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground'
          >
            <Icon iconNode={ExternalLinkIcon} className='size-3.5' />
            Ver projeto
          </a>
        )}
      </div>
    </ContentCard>
  );
}
