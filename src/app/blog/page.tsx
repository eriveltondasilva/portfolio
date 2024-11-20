import { Info } from 'lucide-react'
import { type Metadata } from 'next'

import { Alert } from '@/components/alert'
import { getPosts } from '@/services/post-service'
import { ListItem } from './list-item'
import { TagFilter } from './tag-filter'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Blog page',
}

type BlogPostProps = {
  searchParams: Promise<{
    tag?: string
  }>
}

export default async function BlogPage({ searchParams }: BlogPostProps) {
  const { tag } = await searchParams
  const posts = await getPosts()

  const allTags = [...new Set(posts.flatMap((post) => post?.tags || []))]

  const filteredPosts =
    tag ? posts.filter((post) => post?.tags?.includes(tag)) : posts

  const postCount = filteredPosts?.length

  return (
    <div>
      <header className='mb-4'>
        <h1 className='title'>
          Meus Artigos{postCount > 0 ? `(${postCount})` : ''}:
        </h1>
      </header>

      <TagFilter allTags={allTags} tag={tag} />

      {!postCount && <Alert icon={Info}>There are no posts to display.</Alert>}

      {postCount && (
        <ul className='space-y-8'>
          {filteredPosts?.map((post, index) => (
            <ListItem
              key={post?.slug}
              post={post}
              postCount={postCount}
              index={index}
            />
          ))}
        </ul>
      )}
    </div>
  )
}
