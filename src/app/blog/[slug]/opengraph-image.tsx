import { ImageResponse } from 'next/og'

import { getPost } from '@/services/post-service'
import { formatDate } from '@/utils/date-format'
import { getReadingTime } from '@/utils/reading-time'

export const alt = 'Blog Post Preview'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

type ImageProps = { params: Promise<{ slug: string }> }
export default async function Image({ params }: ImageProps) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) return null

  const date = formatDate(post.createdAt)
  const readingTime = getReadingTime(post.readingTime)

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-end',
          backgroundColor: 'white',
          backgroundImage: 'linear-gradient(to bottom, #f59e0b, #d97706)',
        }}
      >
        <div
          style={{
            marginLeft: 50,
            marginRight: 50,
            marginBottom: 50,
            display: 'flex',
            fontSize: 40,
            fontFamily: 'Georgia, serif',
            letterSpacing: '-0.05em',
            fontStyle: 'normal',
            color: 'white',
            lineHeight: 1.4,
            whiteSpace: 'pre-wrap',
          }}
        >
          {post.title}
        </div>
        <div
          style={{
            marginLeft: 50,
            marginRight: 50,
            marginBottom: 30,
            display: 'flex',
            fontSize: 25,
            fontFamily: 'Arial, sans-serif',
            letterSpacing: '-0.05em',
            fontStyle: 'normal',
            color: 'white',
            lineHeight: 1.4,
            whiteSpace: 'pre-wrap',
          }}
        >
          {post.description}
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            marginLeft: 50,
            marginRight: 50,
            marginBottom: 30,
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              fontSize: 20,
              fontFamily: 'Arial, sans-serif',
              color: 'white',
            }}
          >
            <span>{'By ' + post.author}</span>
            <span>{date}</span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: 20,
              fontFamily: 'Arial, sans-serif',
              color: 'white',
            }}
          >
            {readingTime + ' min de leitura'}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    },
  )
}
