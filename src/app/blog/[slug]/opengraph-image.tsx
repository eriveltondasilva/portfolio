import { ImageResponse } from 'next/og'
import { getPost } from '@/services/post-service'
import { TailwindImage } from '@/components/og-image'

export const alt = 'Blog Post Preview'
export const size = { width: 1200, height: 630 }

export const contentType = 'image/png'

type ImageProps = { params: Promise<{ slug: string }> }
export default async function Image({ params }: ImageProps) {
  const { slug } = await params
  const post = await getPost(slug)

  return new ImageResponse(<TailwindImage title={post?.title} />, {
    ...size,
  })
}
