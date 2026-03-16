import { writeFile } from 'node:fs/promises'
import { join } from 'node:path'

import { z } from 'zod'

import { seriesSchema } from '@/schemas/blog'

const CONTENT_DIR = 'content'
const OUTPUT_SERIES = join(CONTENT_DIR, 'series.schema.json')

async function writeJson(filePath: string, data: unknown): Promise<void> {
  await writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8')
}

async function main() {
  const jsonSchema = z.toJSONSchema(seriesSchema)

  writeJson(OUTPUT_SERIES, jsonSchema)
  console.info('✔ Series JSON Schema generated successfully.')
}

main().catch(console.error)
