import { OGImage } from '@/components/og-image'
import { ImageResponse } from 'next/og'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_req: Request) {
  const post = {
    title: 'Mastering Dynamic OG Images with Next.js and CSS',
    description:
      'Learn how to create stunning, dynamic Open Graph images for your Next.js blog using the power of CSS and the ImageResponse API.',
    author: 'Jane Doe',
    date: 'June 12, 2023',
    readingTime: 5,
    tags: ['Next.js', 'CSS', 'SEO'],
    authorAvatar: 'https://i.pravatar.cc/300',
  }

  return new ImageResponse(<OGImage post={post} />, {
    width: 1200,
    height: 630,
  })
}
