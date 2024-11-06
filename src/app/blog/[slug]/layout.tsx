import { Calendar } from 'lucide-react'

import { getAllPostSlugs, getPostData } from '@/services/post-service'
import { Post } from '@/types'
import { formatDate } from '@/utils/date-format'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPostData(slug)

  return {
    title: post?.title,
    description: post?.description,
  }
}

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs()
  return slugs.map((slug) => ({ slug }))
}

export default async function Layout({
  params,
  children,
}: {
  params: Promise<{ slug: string }>
  children: React.ReactNode
}) {
  const { slug } = await params
  const post: Post = await getPostData(slug)

  return (
    <section>
      <h1 className='title'>
        {post.title}
      </h1>
      <div className='text-medium mb-8 mt-2 flex items-center justify-between'>
        <p className='flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400'>
          <Calendar className='size-4'/>
          {formatDate(post.createdAt)}
        </p>
      </div>
      <article className='prose-quoteless prose prose-neutral dark:prose-invert'>
        {children}
      </article>
    </section>
  )
}
