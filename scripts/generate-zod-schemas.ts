import { writeFile } from 'node:fs/promises'
import { join } from 'node:path'

import { z } from 'zod'

import { postFrontmatterSchema, seriesSchema } from '@/schemas/blog'

const CONTENT_DIR = 'content'
const OUTUT_SERIES = join(CONTENT_DIR, 'series.schema.json')
const OUTUT_POSTS = join(CONTENT_DIR, 'posts.schema.json')

async function writeJson(filePath: string, data: unknown): Promise<void> {
  await writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8')
}

async function main() {
  const jsonSchema = z.toJSONSchema(seriesSchema)
  const postJsonSchema = z.toJSONSchema(postFrontmatterSchema)

  writeJson(OUTUT_POSTS, postJsonSchema)
  console.info('✔ Post Frontmatter JSON Schema generated successfully.')

  writeJson(OUTUT_SERIES, jsonSchema)
  console.info('✔ Series JSON Schema generated successfully.')
}

main().catch(console.error)
