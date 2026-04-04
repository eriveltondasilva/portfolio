import { Tweet as ReactTweet } from 'react-tweet'

import { cn } from '@/lib/utils'

interface Props {
  id: string
  className?: string
}

export function Tweet({ id, className }: Props) {
  return (
    <div data-theme='dark' className={cn('not-prose [&_.react-tweet-theme]:m-0!', className)}>
      <ReactTweet id={id} />
    </div>
  )
}
