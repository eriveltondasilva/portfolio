import Image from 'next/image'

interface Props {
  title: string
  folder: string
  coverFile: string
}

export async function PostCover({ title, folder, coverFile }: Props) {
  const { default: image } = await import(`@/content/posts/${folder}/${coverFile}`)

  return (
    <div className='relative aspect-2/1 w-full overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700/60'>
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
