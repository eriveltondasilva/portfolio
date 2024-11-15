import { Calendar, Clock } from 'lucide-react'
import { clsx } from 'clsx'

import { type ReadingTime } from '@/types'
import { formatDate } from '@/utils/date-format'
import { getReadingTime } from '@/utils/reading-time'

type MetadataProps = { createdAt: string; readingTime: ReadingTime }
export function Metadata({ createdAt, readingTime }: MetadataProps) {
  return (
    <div
      className={clsx(
        'flex flex-wrap items-center gap-x-2',
        'text-medium text-sm',
        'text-neutral-600 dark:text-neutral-400',
      )}
    >
      <div className='flex items-center'>
        <Calendar className='mr-2 size-4' />
        <time dateTime={createdAt}>{formatDate(createdAt)}</time>
      </div>

      <span>|</span>

      <div className='flex items-center'>
        <Clock className='mr-2 size-4' />
        <span>{getReadingTime(readingTime)} min de leitura</span>
      </div>
    </div>
  )
}
