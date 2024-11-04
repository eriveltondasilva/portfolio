import { getAllPosts, getPost } from '@/services/post-service'
import { notFound } from 'next/navigation'
import PostLayout from './post-layout'

export async function generateStaticParams() {
  const posts = await getAllPosts()
  console.log(posts)
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const { frontmatter } = await getPost(slug)

  return {
    title: frontmatter?.title,
    description: frontmatter?.description,
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) {
    return notFound()
  }

  return (
    <PostLayout frontmatter={post.frontmatter}>
      <post.default />
    </PostLayout>
  )
}
