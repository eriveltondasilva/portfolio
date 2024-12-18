import { InfoIcon } from 'lucide-react'
import { type Metadata } from 'next'

import { Alert } from '@/components/alert'
import { getAllPosts } from '@/services/post-service'
import { extractTags, filterPostsByTag } from './helper'
import { List } from './list'
import { TagFilter } from './tag-filter'
import { type Post } from '@/types'

export const metadata: Metadata = {
  title: 'Meus Artigos',
  description: 'Página de listagem de artigos do blog',
}

type BlogPostProps = { searchParams: Promise<{ tag?: string }> }
export default async function BlogPostPage({ searchParams }: BlogPostProps) {
  const { tag } = await searchParams
  const posts: Post[] = await getAllPosts()

  const filteredPosts = filterPostsByTag(posts, tag)
  const allTags = extractTags(posts)

  const postCount = filteredPosts?.length
  const pageTitle = `Meus Artigos${!!postCount ? `(${postCount})` : ''}`

  return (
    <>
      <header className='mb-8'>
        <h1 className='title'>{pageTitle}</h1>
        {!!postCount && <TagFilter allTags={allTags} />}
      </header>

      {!postCount && (
        <Alert icon={InfoIcon}>There are no posts to display.</Alert>
      )}

      <List posts={filteredPosts} />
    </>
  )
}
