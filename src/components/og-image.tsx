import { meta } from '@/config'
import { type Post } from '@/types'
import { formatDate } from '@/utils/date-format'

export function OGImage({ post }: { post: Post | null }) {
  if (!post) return null

  const author = post.author || meta.author
  const date = formatDate(post.createdAt)

  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        backgroundImage: 'linear-gradient(to bottom right, #3b82f6, #10b981)',
      }}
    >
      <div
        style={{
          marginLeft: 60,
          marginRight: 60,
          display: 'flex',
          fontSize: 60,
          fontStyle: 'normal',
          color: 'white',
          lineHeight: 1.2,
          whiteSpace: 'pre-wrap',
        }}
      >
        {post.title}
      </div>
      <div
        style={{
          marginLeft: 60,
          marginRight: 60,
          fontSize: 30,
          fontStyle: 'normal',
          color: 'white',
          marginTop: 30,
          lineHeight: 1.4,
          whiteSpace: 'pre-wrap',
        }}
      >
        {post.description}
      </div>
      <div
        style={{
          marginLeft: 60,
          marginRight: 60,
          fontSize: 26,
          fontStyle: 'normal',
          color: 'white',
          marginTop: 30,
          lineHeight: 1.4,
        }}
      >
        {`By ${author} | ${date}`}
      </div>
    </div>
  )
}

export function TailwindImage({ title }: { title: string }) {
  return <div tw='text-3xl'>{title}</div>
}
