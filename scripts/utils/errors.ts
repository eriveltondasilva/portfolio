import { z } from 'zod';

export class BuildError extends Error {
  constructor(context: string, messages: ReadonlyArray<string>) {
    super(`[${context}] ${messages.length} error(s) found:\n\n${messages.join('\n')}`);
    this.name = 'BuildError';
  }
}

export function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export function throwIfErrors(context: string, errors: readonly string[]): void {
  if (errors.length > 0) throw new BuildError(context, errors);
}

type ResolvedTuple<Tasks extends readonly Promise<unknown>[]> = {
  -readonly [K in keyof Tasks]: Awaited<Tasks[K]>;
};

export async function resolveAll<Tasks extends readonly Promise<unknown>[]>(
  ...tasks: Tasks
): Promise<ResolvedTuple<Tasks>> {
  const results = await Promise.allSettled(tasks);

  const reasons: unknown[] = [];
  const values: unknown[] = [];

  for (const result of results) {
    if (result.status === 'rejected') reasons.push(result.reason);
    else values.push(result.value);
  }

  if (reasons.length > 0) {
    throw new AggregateError(reasons, `${reasons.length} of ${tasks.length} task(s) failed`);
  }

  return values as ResolvedTuple<Tasks>;
}

export function formatZodError(source: string, error: z.ZodError): string {
  return `${source}\n\n${z.prettifyError(error)}`;
}
