import Image from 'next/image'

import { cn } from '@/lib/utils'

import type { ComponentProps } from 'react'

interface Props extends ComponentProps<'div'> {
  title: string
  folder: string
  coverFile: string
}

export async function PostCover({ title, folder, coverFile, className }: Props) {
  const { default: image } = await import(`@/content/posts/${folder}/${coverFile}`)

  return (
    <div
      className={cn(
        'relative aspect-2/1 w-full overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700/60',
        className,
      )}
    >
      <Image
        src={image}
        alt={`Cover: ${title}`}
        className='object-cover'
        sizes='(max-width: 768px) 100vw, 768px'
        loading='eager'
        fill
      />
    </div>
  )
}
