import { ImageResponse } from 'next/og'

import { getPostWithContent } from '#/lib/blog/posts'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OGImage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPostWithContent(slug)

  if (!post) return new ImageResponse(<div>Not found</div>)

  return new ImageResponse(
    <div
      style={{
        background: '#0d1117',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: '60px',
        gap: '16px',
      }}
    >
      <div style={{ color: '#f97316', fontSize: 20, fontFamily: 'monospace' }}>
        erivelton.dev/blog
      </div>
      <div
        style={{
          color: '#f0f6fc',
          fontSize: 52,
          fontWeight: 700,
          lineHeight: 1.2,
        }}
      >
        {post.meta.title}
      </div>
      <div style={{ color: '#8b949e', fontSize: 24 }}>
        {post.meta.description}
      </div>
    </div>,
  )
}
