import clsx from 'clsx'
import { Calendar, Link2 as LinkIcon } from 'lucide-react'
import Link from 'next/link'

import { Badge } from '@/components/badge'
import { type Project } from '@/types'
import { formatDate } from '@/utils/date-format'

export function ListItem({ project }: { project: Project }) {
  const date = formatDate(project.created_at)

  return (
    <li className='space-y-1 text-neutral-700 dark:text-neutral-400'>
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
          <LinkIcon />
          <h2>{project.name.toUpperCase()}</h2>
        </Link>
      </header>

      <div className='flex flex-wrap gap-2'>
        {project.topics?.map((topic) => <Badge key={topic}>{topic}</Badge>)}
        {!project.topics?.length && <Badge>no tags</Badge>}
      </div>

      <p>{project.description || 'No description.'}</p>

      <div className='flex items-center gap-2 text-sm'>
        <Calendar className='size-4' />
        <time dateTime={project.created_at}>{date}</time>
      </div>
    </li>
  )
}
