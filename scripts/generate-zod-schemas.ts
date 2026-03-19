import { join } from 'node:path'

import { z } from 'zod'

import { logSuccess } from '@/lib'
import { authorSchema, seriesSchema } from '@/schemas/blog'

const SCHEMAS_DIR = join(import.meta.dir, '..', 'content', 'schemas')
const OUTPUT_SERIES = join(SCHEMAS_DIR, 'series.json')
const OUTPUT_AUTHORS = join(SCHEMAS_DIR, 'authors.json')

async function main(): Promise<void> {
  const seriesJsonSchema = z.toJSONSchema(seriesSchema.array())
  const authorsJsonSchema = z.toJSONSchema(authorSchema.array())

  await Promise.all([
    Bun.write(OUTPUT_SERIES, JSON.stringify(seriesJsonSchema, null, 2)),
    Bun.write(OUTPUT_AUTHORS, JSON.stringify(authorsJsonSchema, null, 2)),
  ])

  console.info()
  console.info(`> Series schema saved to: ${OUTPUT_SERIES}`)
  console.info(`> Authors schema saved to: ${OUTPUT_AUTHORS}`)
  console.info()
  logSuccess('✔ JSON Schemas generated successfully.')
}

main().catch((error: unknown) => {
  console.error()
  console.error('❌ Erro ao gerar JSON Schemas:')
  console.error(error instanceof Error ? error.message : error)
  console.error()
  console.error('> Corrija os erros acima e tente novamente.')
  console.error()
  process.exit(1)
})
