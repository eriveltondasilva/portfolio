import { FolderOpenIcon, LayersIcon } from 'lucide-react';

import { Icon } from '@/components/icon';
import { ProjectCard } from '@/components/project-card';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { getFeaturedProjects, getOtherProjects } from '@/lib/blog/projects';
import { OG_LOCALE, SITE_NAME, TWITTER_HANDLE } from '@/lib/constants';

import type { Metadata } from 'next';

const meta = {
  title: 'Projetos',
  description: 'Projetos open source e experimentos que desenvolvi.',
};

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: '/projects' },
  openGraph: {
    type: 'website',
    url: '/projects',
    locale: OG_LOCALE,
    siteName: SITE_NAME,
    title: meta.title,
    description: meta.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: meta.title,
    description: meta.description,
    site: TWITTER_HANDLE,
    creator: TWITTER_HANDLE,
  },
};

export default function ProjectsPage() {
  const featuredProjects = getFeaturedProjects();
  const otherProjects = getOtherProjects();

  const projectCount = featuredProjects.length + otherProjects.length;
  const hasFeatured = featuredProjects.length > 0;

  if (projectCount === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant='icon'>
            <FolderOpenIcon />
          </EmptyMedia>

          <EmptyTitle>Nenhum projeto cadastrado</EmptyTitle>

          <EmptyDescription>Os projetos aparecerão aqui.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400'>
        <Icon iconNode={LayersIcon} className='size-3.5' />
        {projectCount} {projectCount === 1 ? 'projeto' : 'projetos'}
      </div>

      {/* Featured */}
      {hasFeatured && (
        <section className='space-y-3'>
          <h2 className='text-xs font-semibold tracking-widest text-zinc-400 uppercase dark:text-zinc-500'>
            Em destaque
          </h2>

          <div className='grid gap-3 sm:grid-cols-2'>
            {featuredProjects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </section>
      )}

      {/* Others */}
      {otherProjects.length > 0 && (
        <section className='space-y-3'>
          {hasFeatured && (
            <h2 className='text-xs font-semibold tracking-widest text-zinc-400 uppercase dark:text-zinc-500'>
              Outros projetos
            </h2>
          )}

          <div className='grid gap-3 sm:grid-cols-2'>
            {otherProjects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
