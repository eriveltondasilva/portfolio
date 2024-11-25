import { Modelo2 as OGImage } from '@/components/post-og'
import { getPost } from '@/services/post-service'
import { ImageResponse } from 'next/og'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.getAll('slug')

  if (!slug || slug.length !== 2) {
    return new Response('Missing "slug" query parameter.', { status: 400 })
  }

  const post = await getPost(slug)

  if (!post) {
    return new Response('Post not found.', { status: 404 })
  }

  return new ImageResponse(<OGImage post={post} />, {
    width: 800,
    height: 400,
  })
}
