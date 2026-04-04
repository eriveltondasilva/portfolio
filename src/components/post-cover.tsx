import { basename, dirname } from 'node:path'

import Image from 'next/image'

interface Props {
  filePath: string
  title: string
}

export async function PostCover({ title, filePath }: Props) {
  let cover = null

  try {
    cover = await import(`@/content/posts/${basename(dirname(filePath))}/cover.jpg`)
  } catch {
    return null
  }

  if (!cover) return null

  return (
    <div className='relative mt-6 aspect-2/1 w-full overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700/60'>
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
