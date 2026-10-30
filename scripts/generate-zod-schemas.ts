import { z } from 'zod';

import {
  AUTHORS_SCHEMA_OUTPUT,
  POST_SCHEMA_OUTPUT,
  SERIES_SCHEMA_OUTPUT,
} from '@/lib/paths';
import { authorSchema, postSchema, seriesSchema } from '@/lib/schemas';

import { runScript } from './utils';
import { log } from './utils/logger';
import { writeJson } from './utils/files';

const targets = [
  {
    name: 'series',
    schema: seriesSchema.array(),
    output: SERIES_SCHEMA_OUTPUT,
  },
  {
    name: 'authors',
    schema: authorSchema.array(),
    output: AUTHORS_SCHEMA_OUTPUT,
  },
  { name: 'post', schema: postSchema, output: POST_SCHEMA_OUTPUT },
] satisfies ReadonlyArray<{ name: string; schema: z.ZodType; output: string }>;

async function main(): Promise<void> {
  log.section('Generating schemas');

  const jsonSchemas = targets.map(({ name, schema, output }) => {
    // These schemas validate what authors write, so fields with `.default()` must stay optional.
    const jsonSchema = z.toJSONSchema(schema, { io: 'input' });
    log.ok(`${name} schema`);

    return { output, jsonSchema };
  });

  log.section('Writing files');

  await Promise.all(
    jsonSchemas.map(({ output, jsonSchema }) => writeJson(output, jsonSchema)),
  );

  for (const { output } of jsonSchemas) log.ok(output);
}

await runScript('Generating JSON Schemas', main);
