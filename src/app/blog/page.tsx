import { getAllPosts } from '@/lib/posts'

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <div>
      <h1>Blog</h1>
      <br />
      <ul>
        {posts.map((post) => (
          <li key={post.slug}>
            <h2>{post.title}</h2>
            <p>{post.description}</p>
            <a href={`/blog/${post.slug}`}>Read more →</a>
            <br />
          </li>
        ))}
      </ul>
    </div>
  )
}
