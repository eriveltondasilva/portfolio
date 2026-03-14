import { getAllPosts, getPostBySlug } from '@/lib/posts'

export const dynamicParams = false

export function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export default async function PostPage() {
  const { Content, post } = await getPostBySlug('tailwind-dicas')
  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.description}</p>
      <hr />
      <Content />
    </div>
  )
}
