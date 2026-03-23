import { z } from 'zod'

import { AUTHORS_SCHEMA_OUTPUT, SERIES_SCHEMA_OUTPUT } from '@/lib/constants'
import { authorSchema, seriesSchema } from '@/lib/schemas'

import { logSuccess, writeJson } from './utils'

async function main(): Promise<void> {
  console.info('⏳ Generating JSON Schemas...\n')

  const seriesJsonSchema = z.toJSONSchema(seriesSchema.array())
  const authorsJsonSchema = z.toJSONSchema(authorSchema.array())

  await Promise.all([
    writeJson(SERIES_SCHEMA_OUTPUT, seriesJsonSchema),
    writeJson(AUTHORS_SCHEMA_OUTPUT, authorsJsonSchema),
  ])

  logSuccess('\n✔ JSON Schemas generated successfully.')
}

main().catch((error: unknown) => {
  console.error('❌ Failed to generate JSON Schemas.')
  console.error(error instanceof Error ? error.message : error)
  console.error('\n> Please fix the errors above and try again.\n')
  process.exit(1)
})
