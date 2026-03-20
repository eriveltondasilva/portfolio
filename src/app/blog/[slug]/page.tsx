import { notFound } from 'next/navigation'

import { getAllPosts, getPostWithContent } from '@/lib/posts'

export const dynamicParams = false

export function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export default async function PostPage({ params }: PageProps<'/blog/[slug]'>) {
  const { slug } = await params
  const post = await getPostWithContent(slug)

  if (!post) return notFound()

  const { meta, Content } = post

  return (
    <div>
      <h1>{meta.title}</h1>
      <p>{meta.description}</p>
      <hr />
      <article className='prose prose-slate dark:prose-invert'>
        <Content />
      </article>
    </div>
  )
}
