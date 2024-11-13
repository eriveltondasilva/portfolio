import { ImageResponse } from 'next/og'
import { meta } from '@/config'

export const runtime = 'edge'

export const alt = meta.title
export const size = { width: 1200, height: 630 }

export const contentType = 'image/png'

type ImageProps = { params: Promise<{ slug: string }> }
export default async function Image({ params }: ImageProps) {
  const { slug } = await params

  return new ImageResponse(
    (
      <div className='flex h-full w-full flex-col items-center justify-center bg-white'>
        <div className='flex w-full flex-col justify-between p-8 px-4 py-12 md:flex-row md:items-center'>
          <h2 className='flex flex-col text-left text-4xl font-bold tracking-tight'>{slug}</h2>
        </div>
      </div>
    ),
    {
      ...size,
    },
  )
}
