import { z } from 'zod'

import {
  AUTHORS_SCHEMA_OUTPUT,
  POSTS_SCHEMA_OUTPUT,
  SERIES_SCHEMA_OUTPUT,
} from '@/lib/constants'
import { authorSchema, postSchema, seriesSchema } from '@/lib/schemas'

import { Logger, writeJson } from './utils'

const log = new Logger()

async function main(): Promise<void> {
  const startedAt = performance.now()

  log.divider()
  console.info('⏳ Generating JSON Schemas...')

  // -- Generate ---------------------------------------------------------------

  log.section('Generating schemas:')

  const seriesJsonSchema = z.toJSONSchema(seriesSchema.array())
  const authorsJsonSchema = z.toJSONSchema(authorSchema.array())
  const postsJsonSchema = z.toJSONSchema(postSchema.array())

  log.ok('series schema')
  log.ok('authors schema')
  log.ok('posts schema')

  // -- Write ------------------------------------------------------------------

  log.section('Writing files:')

  await Promise.all([
    writeJson(SERIES_SCHEMA_OUTPUT, seriesJsonSchema),
    writeJson(AUTHORS_SCHEMA_OUTPUT, authorsJsonSchema),
    writeJson(POSTS_SCHEMA_OUTPUT, postsJsonSchema),
  ])

  log.ok(SERIES_SCHEMA_OUTPUT)
  log.ok(AUTHORS_SCHEMA_OUTPUT)
  log.ok(POSTS_SCHEMA_OUTPUT)

  // -- Done -------------------------------------------------------------------

  const elapsed = (performance.now() - startedAt).toFixed(0)
  log.success(`✅ Done in ${elapsed}ms`)
}

main().catch((error) => {
  log.failure(error)
  process.exit(1)
})
