import { notFound } from 'next/navigation'
import fs from 'node:fs/promises'
import path from 'node:path'
import { cache } from 'react'

const CONTENT_DIR = path.join(process.cwd(), 'content')

function isValidPostPath(slug: string[]): boolean {
  if (slug.length !== 2) return false

  const [year, postSlug] = slug
  return /^\d{4}$/.test(year) && postSlug.trim().length > 0
}

async function importMDX(slug: string[]) {
  if (!isValidPostPath(slug)) return null

  const [year, postSlug] = slug

  try {
    return await import(`/content/${year}/${postSlug}.mdx`)
  } catch (error) {
    console.error('Error importing file at %s:', slug.join(path.sep))
    console.error((error as Error).message)
    return null
  }
}

//

export const getAllPostFiles = cache(async () => {
  const files = await fs.readdir(CONTENT_DIR, { recursive: true })

  return files
    .filter((file) => path.extname(file) === '.mdx')
    .map((file) => file.replace(/\.mdx$/, '').split(path.sep))
    .filter(isValidPostPath)
})

export const getPost = cache(async (slug: string[]) => {
  const post = await importMDX(slug)

  if (!post) return notFound()

  return {
    ...post.frontmatter,
    content: post.default,
    readingTime: post.readingTime,
    slug,
  }
})

export const getAllPosts = cache(async () => {
  const files = await getAllPostFiles()
  const posts = await Promise.all(files.map(getPost))

  return posts
    .filter(Boolean)
    .filter((post) => post.isPublished === true)
    .sort(
      (a, b) =>
        new Date(b.frontmatter?.createdAt).getTime() -
        new Date(a.frontmatter?.createdAt).getTime(),
    )
})
