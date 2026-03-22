import { join } from 'node:path'

import { z } from 'zod'

import { logSuccess, writeJson } from '@/lib'
import { authorSchema, seriesSchema } from '@/lib/schemas'

const SCHEMAS_DIR = join(import.meta.dir, '..', 'content', 'schemas')
const OUTPUT_SERIES = join(SCHEMAS_DIR, 'series.json')
const OUTPUT_AUTHORS = join(SCHEMAS_DIR, 'authors.json')

async function main(): Promise<void> {
  console.info('⏳ Generating JSON Schemas...\n')

  const seriesJsonSchema = z.toJSONSchema(seriesSchema.array())
  const authorsJsonSchema = z.toJSONSchema(authorSchema.array())

  await Promise.all([
    writeJson(OUTPUT_SERIES, seriesJsonSchema),
    writeJson(OUTPUT_AUTHORS, authorsJsonSchema),
  ])

  logSuccess('\n✔ JSON Schemas generated successfully.')
}

main().catch((error: unknown) => {
  console.error('❌ Failed to generate JSON Schemas.')
  console.error(error instanceof Error ? error.message : error)
  console.error('\n> Please fix the errors above and try again.\n')
  process.exit(1)
})
