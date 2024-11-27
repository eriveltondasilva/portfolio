import { ImageResponse } from 'next/og'

export const alt = 'posts page'
export const size = {
  width: 800,
  height: 400,
}

export const contentType = 'image/png'

// type ImageProps = { params: Promise<{ slug: string[] }> }
export default function Image() {
  //   const { slug } = await params

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
        ACME APP
      </div>
    ),
    {
      ...size,
    },
  )
}
