import { Info } from 'lucide-react'
import { type Metadata } from 'next'

import { Alert } from '@/components/alert'
import { getPosts } from '@/services/post-service'
import { ListItem } from './list-item'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Blog page',
}

export default async function BlogPage() {
  const posts = await getPosts()
  const postCount = posts.length

  return (
    <div>
      <header>
        <h1 className='title'>My Blog{postCount > 0 ? `(${postCount})` : ''}:</h1>
      </header>

      {!postCount && <Alert icon={Info}>There are no posts to display.</Alert>}

      <ul className='space-y-8'>
        {posts?.map((post) => <ListItem key={post?.slug} post={post} />)}
      </ul>
    </div>
  )
}
