import { Modelo1 } from '@/components/post-og'
import { getPost } from '@/services/post-service'
import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Blog post thumbnail'
export const size = { width: 800, height: 400 }
export const contentType = 'image/png'

type ImageProps = { params: Promise<{ slug: string }> }
export default async function Image({ params }: ImageProps) {
  const { slug } = await params
  const post = await getPost(slug)

  return new ImageResponse(<Modelo1 post={post} />, {
    ...size,
  })
}
