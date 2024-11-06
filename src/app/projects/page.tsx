import { Project } from '@/types'
import { Link2 as LinkIcon } from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'

import {githubRepos} from '@/data'

export const metadata: Metadata = {
  title: 'Projects',
}

export default async function Projects() {
  const res = await fetch(githubRepos, { cache: 'force-cache' })
  const projects: Project[] = await res.json()

  const projectsCount = projects.length

  return (
    <div>
      <h1 className='title'>
        Projects{projectsCount > 0 ? `(${projectsCount})` : ''}:
      </h1>

      <br />

      {!projectsCount && <p>There are no projects to display.</p>}

      <ul className='space-y-5'>
        {projectsCount &&
          projects.map((project) => (
            <List key={project.id} project={project} />
          ))}
      </ul>
    </div>
  )
}

function List({ project }: { project: Project }) {
  const { name, description, html_url, created_at, topics } = project
  const date = new Date(created_at).toLocaleDateString('pt-BR')
  const className = 'text-slate-600 dark:text-slate-400'

  return (
    <li className=''>
      <h2 className='flex gap-2 font-extrabold decoration-sky-600 decoration-2 hover:underline dark:decoration-sky-400'>
        <LinkIcon />
        <Link href={html_url}>{name.toUpperCase()}</Link>
      </h2>

      <p>
        description:&nbsp;
        <span className={className}>{description || 'no description'}</span>
      </p>

      <p>
        tags:&nbsp;
        <span className={className}>{topics?.join(', ') || 'no tag'}</span>
      </p>
      <p>
        created:&nbsp;<time className={className}>{date}</time>
      </p>
    </li>
  )
}
