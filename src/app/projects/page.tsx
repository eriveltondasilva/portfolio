import { Project } from '@/types'
import { Link2 as LinkIcon } from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'
import path from 'node:path'

export const metadata: Metadata = {
  title: 'Projects',
}
const url = path.join(process.env.API_GITHUB || '', 'repos')

export default async function Projects() {
  const data = await fetch(url)
  const projects: Project[] = await data.json()

  const hasProjects = projects.length > 0

  console.log('url:', url)

  return (
    <div>
      <h1 className='text-2xl'>
        Projects{projects.length ? '(' + projects.length + ')' : ''}:
      </h1>

      <br />

      {!hasProjects && <p>não tem projetos</p>}

      <ul>
        {hasProjects &&
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

      <br />
    </li>
  )
}
