import Image from 'next/image'

interface Props {
  filePath: string
  cover: string
  title: string
}

export async function PostCover({ cover, filePath, title }: Props) {
  return (
    <div className='relative mb-8 aspect-2/1 w-full overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700/60'>
      <Image
        src={cover}
        alt={`Cover: ${title}`}
        fill
        loading='eager'
        className='object-cover'
        sizes='(max-width: 768px) 100vw, 768px'
      />
    </div>
  )
}
