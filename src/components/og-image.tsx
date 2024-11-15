type Post = {
  title: string
  description: string
  author: string
  date: string
  readingTime: number
  tags: string[]
  authorAvatar: string
}

export function OGImage({ post }: { post: Post }) {
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
        {'By ' +
          post.author +
          ' | ' +
          post.date +
          ' | ' +
          post.readingTime +
          ' min read'}
      </div>
    </div>
  )
}

export function TailwindImage({ post }: { post: Post }) {
  return <div tw='text-3xl'>{post.title}</div>
}
