import { z } from 'zod'

import { AUTHORS_SCHEMA_OUTPUT, SERIES_SCHEMA_OUTPUT } from '@/lib/constants'
import { authorSchema, seriesSchema } from '@/lib/schemas'

import { log, writeJson } from './utils'

async function main(): Promise<void> {
  const startedAt = performance.now()
  console.info('\n⏳ Generating JSON Schemas...')

  // -- Generate ---------------------------------------------------------------

  log.section('Generating schemas...')

  const seriesJsonSchema = z.toJSONSchema(seriesSchema.array())
  const authorsJsonSchema = z.toJSONSchema(authorSchema.array())

  log.ok('series schema')
  log.ok('authors schema')

  // -- Write ------------------------------------------------------------------

  log.section('Writing files')

  await Promise.all([
    writeJson(SERIES_SCHEMA_OUTPUT, seriesJsonSchema),
    writeJson(AUTHORS_SCHEMA_OUTPUT, authorsJsonSchema),
  ])

  log.ok(SERIES_SCHEMA_OUTPUT)
  log.ok(AUTHORS_SCHEMA_OUTPUT)

  // -- Done -------------------------------------------------------------------

  const elapsed = (performance.now() - startedAt).toFixed(0)
  log.success(`\n✔ Done in ${elapsed}ms`)
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error)
  log.failure(message)
  process.exit(1)
})
