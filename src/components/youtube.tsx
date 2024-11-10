'use client'
import YouTubePlayer, { type YouTubePlayerProps } from 'react-player/youtube'

export function YouTubeComponent({ id, url, ...props }: YouTubePlayerProps) {
  const href = `https://www.youtube.com/watch?v=${id}`

  return (
    <div className='relative pb-[56.25%]'>
      <YouTubePlayer
        className='absolute left-0 top-0 h-full w-full'
        url={id ? href : url}
        height='100%'
        width='100%'
        {...props}
      />
    </div>
  )
}
