import { clsx } from 'clsx'
import { CalendarIcon, ClockIcon } from 'lucide-react'

import { formatDate } from '@/utils/date-format'
import { getReadingTime } from '@/utils/reading-time'

import { type ReadingTime } from '@/types'
import { Badge } from './badge'

type MetadataProps = {
  createdAt?: string
  readingTime?: ReadingTime
  tags?: string[]
}
export function Metadata({ createdAt, readingTime, tags }: MetadataProps) {
  return (
    <section>
      <div
        className={clsx(
          'flex flex-wrap items-center gap-x-4',
          'text-medium text-sm',
          'text-neutral-600 dark:text-neutral-400',
        )}
      >
        {createdAt && (
          <div
            className='flex items-center gap-2'
            aria-label='Data de publicação'
          >
            <CalendarIcon className='size-4' />
            <time dateTime={createdAt}>{formatDate(createdAt)}</time>
          </div>
        )}

        {readingTime && (
          <div
            className='flex items-center gap-2'
            aria-label='Tempo estimado de leitura'
          >
            <ClockIcon className='size-4' />
            <span>{getReadingTime(readingTime)} min de leitura</span>
          </div>
        )}
      </div>

      <div className='mt-2 flex flex-wrap gap-2'>
        {!!tags?.length ?
          tags.map((tag) => <Badge key={tag}>{tag}</Badge>)
        : <Badge>Sem tags</Badge>}
      </div>
    </section>
  )
}
