'use client'
import clsx from 'clsx'
import { Link2Icon } from 'lucide-react'

import { Metadata } from '@/components/metadata'
import { type Project } from '@/types'
import { useState } from 'react'

export function List({ projects }: { projects: Project[] }) {
  const [visibleCount, setVisibleCount] = useState(10)

  const showMoreProjects = () => setVisibleCount((prev) => prev + 10)

  const visibleProjects = projects.slice(0, visibleCount)

  return (
    <>
      <ul className='divide-y divide-gray-200 dark:divide-gray-700'>
        {visibleProjects.map((project) => (
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

      {projects.length > visibleCount && (
        <div className='mt-8 text-center'>
          <button
            onClick={showMoreProjects}
            className={clsx(
              'px-5 py-2 text-sm font-medium',
              'transform transition-transform duration-200 ease-in-out',
              'rounded-lg hover:scale-105 active:scale-95',
              'bg-blue-700 text-white dark:bg-blue-600',
              'hover:bg-blue-800 dark:hover:bg-blue-700',
            )}
          >
            carregar mais projetos
          </button>
        </div>
      )}
    </>
  )
}
