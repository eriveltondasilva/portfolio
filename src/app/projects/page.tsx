import { InfoIcon } from 'lucide-react'
import { type Metadata } from 'next'

import { Alert } from '@/components/alert'
import { List } from './list'

import { fetchGithubRepos } from '@/services/fetch-github-repos'
import { type Project } from '@/types'

export const metadata: Metadata = {
  title: 'Meus Projetos',
  description: 'Página para exibição de projetos no Github',
}

export default async function Projects() {
  const projects: Project[] = await fetchGithubRepos()

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
