import { ImageResponse } from 'next/og'

export const runtime = 'edge'

// Image metadata
export const alt = 'posts page'
export const size = {
  width: 800,
  height: 400,
}

export const contentType = 'image/png'

type ImageProps = { params: Promise<{ slug: string[] }> }
export default async function Image({ params }: ImageProps) {
  const { slug } = await params

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {slug.join('-')}
      </div>
    ),
    {
      ...size,
    },
  )
}
