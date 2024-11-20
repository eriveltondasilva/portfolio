import fs from 'node:fs/promises'
import path from 'node:path'
import { cache } from 'react'

import { type Post } from '@/types'

const CONTENT_DIR = path.join(process.cwd(), 'content')
const MDX_EXTENSION = '.mdx'

async function loadPost(slug: string) {
  try {
    return await import(`/content/${slug}${MDX_EXTENSION}`)
  } catch (err) {
    console.error(`Failed to load post: ${slug}.`, err)
    return null
  }
}

async function getMetadata(slug: string) {
  const post = await loadPost(slug)

  if (!post) return null

  return {
    ...post.frontmatter,
    readingTime: post.readingTime,
    slug,
  }
}

//
export const getSlugs = cache(async (): Promise<string[]> => {
  try {
    const files = await fs.readdir(CONTENT_DIR)

    return files
      .filter((file) => file.endsWith(MDX_EXTENSION))
      .map((file) => path.basename(file, MDX_EXTENSION))
  } catch (err) {
    console.error(`Failed to read content directory: ${CONTENT_DIR}.`, err)
    return []
  }
})

export const getPost = cache(async (slug: string): Promise<Post | null> => {
  const post = await loadPost(slug)

  if (!post?.frontmatter || !post?.default) return null

  return {
    ...post.frontmatter,
    content: post.default,
    readingTime: post.readingTime,
    slug,
  }
})

export const getPosts = cache(async (): Promise<(Post | null)[]> => {
  const slugs = await getSlugs()

  const posts = await Promise.all(slugs.map((slug) => getMetadata(slug)))

  return posts
    .filter((post) => post?.title !== null && post?.published === true)
    .sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
})
