import { dirname, basename } from 'node:path'

import Image from 'next/image'

import { COVER_NAME } from '@/lib/constants'

interface Props {
  title: string
  filePath: string
}

export async function PostCover({ title, filePath }: Props) {
  const { default: image } = await import(
    `@/content/posts/${basename(dirname(filePath))}/${COVER_NAME}`
  )

  return (
    <div className='relative mt-6 aspect-2/1 w-full overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700/60'>
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
