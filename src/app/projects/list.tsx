import clsx from 'clsx'
import { Link2Icon } from 'lucide-react'

import { Metadata } from '@/components/metadata'
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
              <a
                href={project.html_url}
                className={clsx(
                  'flex gap-2 font-semibold',
                  'hover:underline hover:underline-offset-2',
                  'text-neutral-900 dark:text-neutral-50',
                  'decoration-sky-600 decoration-3',
                  'dark:decoration-sky-400',
                )}
                rel='noopener noreferrer'
                target='_blank'
              >
                <Link2Icon aria-hidden='true' />
                <h2>{project.name.toUpperCase()}</h2>
              </a>
            </header>

            <p>{project.description || 'No description.'}</p>

            <Metadata
              createdAt={project.created_at}
              tags={project.topics}
            />
          </article>
        </li>
      ))}
    </ul>
  )
}
