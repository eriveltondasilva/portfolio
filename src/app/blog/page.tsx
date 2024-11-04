import { getAllPosts } from '@/services/post-service'
import { Metadata } from 'next'
import Link from 'next/link'
import { Link2 as LinkIcon } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Blog',
}

export default async function BlogPage() {
  const posts = await getAllPosts()

  return (
    <>
      <h1 className='text-3xl'>My Blog</h1>
      <br />
      <ul>
        {posts.map(
          ({ slug, frontmatter: { title, description, createdAt } }) => (
            <>
              <li key={slug}>
                <Link className='flex gap-2' href={`/blog/${slug}`}>
                  <LinkIcon />
                  <h2>{title.toUpperCase()}</h2>
                </Link>

                <p>{description}</p>
                <time>{new Date(createdAt).toLocaleDateString('pt-BR')}</time>
              </li>
              <br />
            </>
          ),
        )}
      </ul>
    </>
  )
}
