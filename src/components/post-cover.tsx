import { basename, dirname } from 'node:path'

import Image from 'next/image'

import { cn } from '@/lib/utils'

interface Props {
  filePath: string
  title: string
  className?: string
}

export async function PostCover({ title, filePath, className }: Props) {
  const { default: cover } = await import(
    `@/content/posts/${basename(dirname(filePath))}/cover.jpg`
  )

  return (
    <div
      className={cn(
        'relative aspect-2/1 w-full overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700/60',
        className,
      )}
    >
      <Image
        src={cover}
        alt={`Cover: ${title}`}
        className='object-cover'
        sizes='(max-width: 768px) 100vw, 768px'
        loading='eager'
        fill
      />
    </div>
  )
}
