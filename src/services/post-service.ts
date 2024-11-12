import fs from 'node:fs/promises'
import path from 'node:path'

import { cache } from 'react'

const MDX_EXTENSION = '.mdx'

//
async function loadPost(slug: string) {
  try {
    return await import(`/src/markdown/${slug}${MDX_EXTENSION}`)
  } catch (e) {
    console.error(`Error loading post: %s`, slug)
    console.error(e)
    return null
  }
}

async function getMarkdownFiles() {
  const dir = path.join(process.cwd(), 'src', 'markdown')
  return await fs.readdir(dir)
}

async function getPostMetadata(slug: string) {
  const { frontmatter } = await loadPost(slug)
  return { ...frontmatter, slug }
}

//
export const getAllPostSlugs = cache(async () => {
  const files = await getMarkdownFiles()
  return files
    .filter((file) => file.endsWith(MDX_EXTENSION))
    .map((file) => file.replace(MDX_EXTENSION, ''))
})

export const getPostData = cache(async (slug: string) => {
  const post = await loadPost(slug)

  return {
    slug,
    ...post.frontmatter,
    content: post.default,
  }
})

export const getAllPostMetadata = cache(async () => {
  const slugs = await getAllPostSlugs()

  const posts = await Promise.all(
    slugs.map(async (slug) => {
      return await getPostMetadata(slug)
    }),
  )

  return posts
    .sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
    .filter((post) => post.published)
})
