import { Info } from 'lucide-react'
import { type Metadata } from 'next'
import { Fragment } from 'react'

import { Alert } from '@/components/alert'
import { Separator } from '@/components/separator'
import { getPosts } from '@/services/post-service'
import { ListItem } from './list-item'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Blog page',
}

export default async function BlogPage() {
  const posts = await getPosts()
  const postCount = posts?.length

  return (
    <div>
      <header className='mb-4'>
        <h1 className='title'>
          Meus Artigos{postCount > 0 ? `(${postCount})` : ''}:
        </h1>
      </header>

      {!postCount && <Alert icon={Info}>There are no posts to display.</Alert>}

      {postCount && (
        <ul className='space-y-8'>
          {posts?.map((post, index) => (
            <Fragment key={post?.slug}>
              <ListItem post={post} />
              {postCount !== ++index && <Separator />}
            </Fragment>
          ))}
        </ul>
      )}
    </div>
  )
}
