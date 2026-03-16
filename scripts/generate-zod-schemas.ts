import { writeFile } from 'node:fs/promises'
import { join } from 'node:path'

import { z } from 'zod'

import { authorSchema, seriesSchema } from '@/schemas/blog'

const SCHEMAS_DIR = join('content', 'schemas')
const OUTPUT_SERIES = join(SCHEMAS_DIR, 'series.json')
const OUTPUT_AUTHORS = join(SCHEMAS_DIR, 'authors.json')

async function writeJson(filePath: string, data: unknown): Promise<void> {
  await writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8')
}

async function main() {
  const seriesJsonSchema = z.toJSONSchema(seriesSchema.array())
  const authorsJsonSchema = z.toJSONSchema(authorSchema.array())

  writeJson(OUTPUT_SERIES, seriesJsonSchema)
  console.info('✔ Series JSON Schema generated successfully.')

  writeJson(OUTPUT_AUTHORS, authorsJsonSchema)
  console.info('✔ Authors JSON Schema generated successfully.')
}

main().catch(console.error)
