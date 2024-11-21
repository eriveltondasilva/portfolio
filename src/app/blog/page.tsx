import { InfoIcon } from 'lucide-react'
import { type Metadata } from 'next'

import { Alert } from '@/components/alert'
import { getPosts } from '@/services/post-service'
import { extractTags, filterPostsByTag } from './helper'
import { List } from './list'
import { TagFilter } from './tag-filter'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Página de listagem de artigos do blog',
}

type BlogPostProps = { searchParams: Promise<{ tag?: string }> }
export default async function BlogPostPage({ searchParams }: BlogPostProps) {
  const { tag } = await searchParams
  const posts = await getPosts()

  const filteredPosts = filterPostsByTag(posts, tag)
  const allTags = extractTags(posts)

  const postCount = filteredPosts?.length
  const pageTitle = `Meus Artigos${postCount > 0 ? ` (${postCount})` : ''}:`

  return (
    <div>
      <header className='mb-8'>
        <h1 className='title'>{pageTitle}</h1>
        <TagFilter allTags={allTags} />
      </header>

      {!postCount && (
        <Alert icon={InfoIcon}>There are no posts to display.</Alert>
      )}

      <List
        posts={filteredPosts}
        count={postCount}
      />
    </div>
  )
}
