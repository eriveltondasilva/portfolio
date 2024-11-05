import { getAllPostSlugs, getPostData } from '@/services/post-service'

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
  const post = await getPostData(slug)

  return (
    <article>
      <h1>title: {post.title}</h1>
      <p>description: {post.description}</p>
      <p>tags: {post.tags.join(', ')}</p>
      <p>published: {post.published}</p>
      <p>createdAt: {post.createdAt}</p>
      <br />

      {children}
    </article>
  )
}
