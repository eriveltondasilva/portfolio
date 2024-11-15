import { ImageResponse } from 'next/og'
import styles from './opengraph-image.module.css'

export const runtime = 'edge'

export const alt = 'Blog Post Preview'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function Image({ params }: { params: { slug: string } }) {
  const post = await fetchPostData(params.slug)

  return new ImageResponse(
    (
      <div style={styles}>
        <div className='container'>
          <div className='header'>
            <div className='blog-title'>Acme Blog</div>
            <div className='tags'>
              {post.tags.map((tag, index) => (
                <div key={index} className='tag'>
                  {tag}
                </div>
              ))}
            </div>
          </div>

          <div className='content'>
            <h1 className='post-title'>{post.title}</h1>
            <p className='post-description'>{post.description}</p>
          </div>

          <div className='footer'>
            <div className='author'>
              <img
                src={post.authorAvatar}
                alt={post.author}
                className='author-avatar'
              />
              <div>
                <div className='author-name'>{post.author}</div>
                <div className='post-date'>{post.date}</div>
              </div>
            </div>
            <div className='reading-time'>{post.readingTime} min read</div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    },
  )
}

// This is a mock function. In a real application, you would fetch the post data from your database or API.
async function fetchPostData(slug: string) {
  // Simulating an API call
  await new Promise((resolve) => setTimeout(resolve, 100))

  return {
    title: 'Mastering Dynamic OG Images with Next.js and CSS',
    description:
      'Learn how to create stunning, dynamic Open Graph images for your Next.js blog using the power of CSS and the ImageResponse API.',
    author: 'Jane Doe',
    authorAvatar: 'https://i.pravatar.cc/300',
    date: 'June 12, 2023',
    readingTime: 5,
    tags: ['Next.js', 'CSS', 'SEO'],
  }
}
