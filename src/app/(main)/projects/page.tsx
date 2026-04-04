import { FolderOpenIcon, LayersIcon } from 'lucide-react'

import { Icon } from '@/components/icon'
import { ProjectCard } from '@/components/project-card'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { getAllProjects } from '@/lib/blog/projects'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Projetos',
  description: 'Projetos open source e experimentos que desenvolvi.',
}

export default function ProjectsPage() {
  const projects = getAllProjects()
  const hasProjects = projects.length > 0
  const projectCount = projects.length

  const featuredProjects = projects.filter((project) => project.featured)
  const othersProjects = projects.filter((project) => !project.featured)

  return (
    <div className='space-y-6'>
      {/* Header */}
      {hasProjects && (
        <div className='flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400'>
          <Icon iconNode={LayersIcon} className='size-3.5' />
          {projectCount} {projectCount > 1 ? 'projetos' : 'projeto'}
        </div>
      )}

      {/* Featured */}
      {featuredProjects.length > 0 && (
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
      {othersProjects.length > 0 && (
        <section className='space-y-3'>
          {featuredProjects.length > 0 && (
            <h2 className='text-xs font-semibold tracking-widest text-zinc-400 uppercase dark:text-zinc-500'>
              Outros projetos
            </h2>
          )}
          <div className='grid gap-3 sm:grid-cols-2'>
            {othersProjects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </section>
      )}

      {!hasProjects && (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant='icon'>
              <FolderOpenIcon />
            </EmptyMedia>
            <EmptyTitle>Nenhum projeto cadastrado</EmptyTitle>
            <EmptyDescription>Os projetos aparecerão aqui.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
    </div>
  )
}
