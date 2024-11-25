import { InfoIcon } from 'lucide-react'
import { type Metadata } from 'next'

import { Alert } from '@/components/alert'
import { url } from '@/config'
import { List } from './list'

import { type Project } from '@/types'

export const metadata: Metadata = {
  title: 'Meus Projetos',
  description: 'Página para exibição de projetos no Github',
}

export default async function Projects() {
  const res = await fetch(url.githubRepos, { cache: 'force-cache' })
  const projects: Project[] = await res.json()

  const projectsCount = projects.length
  const pageTitle = `Meus Projetos${!!projectsCount ? `(${projectsCount})` : ''}`

  return (
    <>
      <header className='mb-8'>
        <h1 className='title'>{pageTitle}</h1>
      </header>

      {!projectsCount && (
        <Alert icon={InfoIcon}>There are no projects to display.</Alert>
      )}

      <List projects={projects} />
    </>
  )
}
