import { Tweet as ReactTweet } from 'react-tweet';
import { cn } from 'cn';

interface TweetProps {
  id: string;
  className?: string;
}

export function Tweet({ id, className }: TweetProps) {
  return (
    <div className={cn('not-prose [&_.react-tweet-theme]:m-0!', className)}>
      <ReactTweet id={id} />
    </div>
  );
}
