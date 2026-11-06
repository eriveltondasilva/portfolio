import { Tweet as ReactTweet } from 'react-tweet';

import { cn } from '@/lib/utils';

interface TweetProps {
  id: string;
  className?: string;
}

export function Tweet({ id, className }: TweetProps) {
  return (
    <div
      data-theme='light'
      className={cn('not-prose [&_.react-tweet-theme]:m-0!', className)}
    >
      <ReactTweet id={id} />
    </div>
  );
}
