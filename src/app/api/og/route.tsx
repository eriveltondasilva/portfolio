import { TailwindImage } from '@/components/og-image'
import { meta } from '@/config'
import { ImageResponse } from 'next/og'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const title = searchParams.get('title') || meta.title

  return new ImageResponse(<TailwindImage title={title} />, {
    width: 1200,
    height: 630,
  })
}
