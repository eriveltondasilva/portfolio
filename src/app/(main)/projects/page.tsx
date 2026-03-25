import { ProjectCard } from '@/components/project-card'
import { getAllProjects } from '@/lib/blog/projects'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Projetos',
  description: 'Projetos open source e experimentos que desenvolvi.',
}

export default function ProjectsPage() {
  const projects = getAllProjects()
  const featured = projects.filter((p) => p.featured)
  const others = projects.filter((p) => !p.featured)

  return (
    <div className='space-y-8'>
      {/* Header */}
      <div className='border-b border-zinc-100 pb-4 dark:border-zinc-800'>
        <p className='text-sm text-zinc-500 dark:text-zinc-400'>
          {projects.length} {projects.length === 1 ? 'projeto' : 'projetos'}
        </p>
      </div>

      {/* Featured */}
      {featured.length > 0 && (
        <section className='space-y-3'>
          <h2 className='text-xs font-semibold tracking-widest text-zinc-400 uppercase dark:text-zinc-500'>
            Em destaque
          </h2>
          <div className='grid gap-3 sm:grid-cols-2'>
            {featured.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </section>
      )}

      {/* Others */}
      {others.length > 0 && (
        <section className='space-y-3'>
          {featured.length > 0 && (
            <h2 className='text-xs font-semibold tracking-widest text-zinc-400 uppercase dark:text-zinc-500'>
              Outros projetos
            </h2>
          )}
          <div className='grid gap-3 sm:grid-cols-2'>
            {others.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </section>
      )}

      {projects.length === 0 && (
        <div className='py-16 text-center'>
          <p className='text-sm text-zinc-500 dark:text-zinc-400'>
            Nenhum projeto cadastrado ainda.
          </p>
        </div>
      )}
    </div>
  )
}
