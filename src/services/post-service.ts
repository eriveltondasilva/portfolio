import fs from 'node:fs/promises'
import path from 'node:path'

export async function getPost(slug: string) {
  try {
    const post = await import(`/src/markdown/${slug}.mdx`)

    return {
      slug,
      ...post,
    }
  } catch (e) {
    console.error('\nErro ao buscar post: %s', slug)
    console.error((e as Error).message)
    console.error((e as Error).stack)
    return null
  }
}

export async function getAllPosts() {
  try {
    const files = await fs.readdir(path.join(process.cwd(), 'src/markdown'))

    const posts = await Promise.all(
      files
        .filter((file) => file.endsWith('.mdx'))
        .map(async (file) => getPost(file.replace('.mdx', ''))),
    )

    return posts
  } catch (e: Error | unknown) {
    console.error('Erro ao buscar posts\n')
    console.error(e)
    return []
  }
}
