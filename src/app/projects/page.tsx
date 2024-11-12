import clsx from 'clsx'
import { Calendar, Info, Link2 as LinkIcon } from 'lucide-react'
import { type Metadata } from 'next'
import Link from 'next/link'

import { Alert } from '@/components/alert'
import { Badge } from '@/components/badge'

import { githubRepos } from '@/config'
import { formatDate } from '@/utils/date-format'

import { type Project } from '@/types'

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Projects page',
}

function ListItem({ project }: { project: Project }) {
  const { name, description, html_url, created_at, topics } = project
  const date = formatDate(created_at)

  return (
    <li className='space-y-1 text-neutral-700 dark:text-neutral-400'>
      <header>
        <Link
          className={clsx(
            'flex gap-2 font-semibold',
            'hover:underline hover:underline-offset-2',
            'text-neutral-900 dark:text-neutral-50',
            'decoration-sky-600 decoration-3',
            'dark:decoration-sky-400',
          )}
          href={html_url}
        >
          <LinkIcon />
          <h2>{name.toUpperCase()}</h2>
        </Link>
      </header>

      <div className='flex flex-wrap gap-y-2'>
        {topics?.map((topic) => <Badge key={topic}>{topic}</Badge>)}
      </div>

      <p>{description || 'No description.'}</p>

      <div className='flex gap-2 text-sm'>
        <Calendar className='size-4' />
        <time>{date}</time>
      </div>
    </li>
  )
}

export default async function Projects() {
  const res = await fetch(githubRepos, { cache: 'force-cache' })
  const projects: Project[] = await res.json()

  const projectsCount = projects.length

  return (
    <div>
      <header>
        <h1 className='title'>
          Projects{projectsCount > 0 ? `(${projectsCount})` : ''}:
        </h1>
      </header>

      {!projects.length && (
        <Alert icon={Info}>There are no projects to display.</Alert>
      )}

      <ul className='space-y-8'>
        {projects.map((project) => (
          <ListItem key={project.id} project={project} />
        ))}
      </ul>
    </div>
  )
}
