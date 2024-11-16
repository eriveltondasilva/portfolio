```ts
import fs from 'node:fs/promises'
import path from 'node:path'

type Metadata = {
  title: string
  publishedAt: string
  summary: string
  tags: string
}

const FRONTMATTER_REGEX = /^---\s*([\s\S]*?)\s*---/
const CONTENT_DIR = path.join(process.cwd(), 'src/content')
const MDX_EXTENSION = '.mdx'

async function parseFrontmatter(
  fileContent: string,
): Promise<{ metadata: Metadata; content: string }> {
  const match = FRONTMATTER_REGEX.exec(fileContent)
  if (!match) throw new Error('Frontmatter not found')

  const metadata = parseMetadata(match[1])
  const content = fileContent.replace(FRONTMATTER_REGEX, '').trim()

  return { metadata, content }
}

function parseMetadata(frontMatterBlock: string): Metadata {
  const metadata: Partial<Metadata> = {}

  frontMatterBlock.split('\n').forEach((line) => {
    const [key, ...valueArr] = line.split(': ')
    const formattedKey = key.trim() as keyof Metadata

    if (formattedKey && valueArr.length) {
      const value = valueArr
        .join(': ')
        .trim()
        .replace(/^['"](.*)['"]$/, '$1')
      metadata[formattedKey] = value
    }
  })

  return metadata as Metadata
}

async function getMDXFiles(dir: string): Promise<string[]> {
  const files = await fs.readdir(dir)
  return files.filter((file) => file.endsWith(MDX_EXTENSION))
}

async function readMDXFile(
  filePath: string,
): Promise<{ metadata: Metadata; content: string }> {
  const rawContent = await fs.readFile(filePath, 'utf-8')
  return parseFrontmatter(rawContent)
}

async function getMDXData(dir: string) {
  const files = await getMDXFiles(dir)

  return Promise.all(
    files.map(async (file) => {
      const filePath = path.join(dir, file)
      const slug = path.basename(file, MDX_EXTENSION)
      const { metadata, content } = await readMDXFile(filePath)

      return { metadata, slug, content }
    }),
  )
}

export async function getBlogPosts() {
  return getMDXData(CONTENT_DIR)
}

export async function getBlogPost(slug: string) {
  const filePath = path.join(CONTENT_DIR, slug, MDX_EXTENSION)

  try {
    return await readMDXFile(filePath)
  } catch (error: any) {
    throw new Error(`Error reading file ${filePath}: ${error.message}`)
  }
}
```
