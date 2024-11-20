import clsx from 'clsx'
import { CalendarIcon, Link2Icon } from 'lucide-react'
import Link from 'next/link'

import { Badge } from '@/components/badge'
import { Separator } from '@/components/separator'
import { formatDate } from '@/utils/date-format'

import { Project } from '@/types'

type ListProps = { projects: Project[]; count: number }
export function List({ projects, count }: ListProps) {
  return (
    <ul className='space-y-8'>
      {projects?.map((project, index) => (
        <li
          key={project.id}
          className='text-neutral-700 dark:text-neutral-400'
        >
          <article className='space-y-1'>
            <header>
              <Link
                href={project.html_url}
                className={clsx(
                  'flex gap-2 font-semibold',
                  'hover:underline hover:underline-offset-2',
                  'text-neutral-900 dark:text-neutral-50',
                  'decoration-sky-600 decoration-3',
                  'dark:decoration-sky-400',
                )}
              >
                <Link2Icon aria-hidden='true' />
                <h2>{project.name.toUpperCase()}</h2>
              </Link>
            </header>

            <div className='flex flex-wrap gap-2'>
              {project.topics.length > 0 ?
                project.topics.map((topic) => (
                  <Badge key={topic}>{topic}</Badge>
                ))
              : <Badge>No tags</Badge>}
            </div>

            <p>{project.description || 'No description.'}</p>

            <div className='flex items-center gap-2 text-sm'>
              <CalendarIcon className='size-4' />
              <time dateTime={project.created_at}>
                {formatDate(project.created_at)}
              </time>
            </div>
          </article>
          {index < count - 1 && <Separator />}
        </li>
      ))}
    </ul>
  )
}
