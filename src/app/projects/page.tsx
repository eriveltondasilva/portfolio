import { Info } from 'lucide-react'
import { type Metadata } from 'next'

import { Alert } from '@/components/alert'
import { Separator } from '@/components/separator'
import { url } from '@/config'
import { type Project } from '@/types'
import { Fragment } from 'react'
import { ListItem } from './list-item'

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Projects page',
}

export default async function Projects() {
  const res = await fetch(url.githubRepos, { cache: 'force-cache' })
  const projects: Project[] = await res.json()

  const projectsCount = projects?.length

  return (
    <div>
      <header>
        <h1 className='title'>
          Projects{projectsCount > 0 ? `(${projectsCount})` : ''}:
        </h1>
      </header>

      {!projects?.length && (
        <Alert icon={Info}>There are no projects to display.</Alert>
      )}

      <ul className=''>
        {projects?.map((project, index) => (
          <Fragment key={project.id}>
            <ListItem project={project} />
            {projectsCount !== ++index && <Separator />}
          </Fragment>
        ))}
      </ul>
    </div>
  )
}
