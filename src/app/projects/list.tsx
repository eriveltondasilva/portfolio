import clsx from 'clsx'
import { CalendarIcon, Link2Icon } from 'lucide-react'
import Link from 'next/link'

import { Badge } from '@/components/badge'
import { formatDate } from '@/utils/date-format'

import { type Project } from '@/types'

export function List({ projects }: { projects: Project[] }) {
  return (
    <ul className='divide-y divide-gray-200 dark:divide-gray-700'>
      {projects.map((project) => (
        <li
          key={project.id}
          className={clsx(
            'flex py-6 first:pt-0 last:pb-0',
            'text-neutral-700 dark:text-neutral-400',
          )}
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
              {!!project.topics.length ?
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
        </li>
      ))}
    </ul>
  )
}
