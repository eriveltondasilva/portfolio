import z from 'zod';

export class BuildError extends Error {
  constructor(
    readonly context: string,
    messages: readonly string[],
  ) {
    super(
      `[${context}] ${messages.length} error(s) found:\n\n${messages.join('\n')}`,
    );
    this.name = 'BuildError';
  }
}

export function getErrMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export function throwIfErrors(
  context: string,
  errors: readonly string[],
): void {
  if (errors.length > 0) throw new BuildError(context, errors);
}

/**
 * Like `Promise.all`, but waits for every task and reports all failures at once,
 * so a build surfaces every problem in a single run.
 */
export async function resolveAll<Tasks extends readonly Promise<unknown>[]>(
  ...tasks: Tasks
): Promise<{ -readonly [K in keyof Tasks]: Awaited<Tasks[K]> }> {
  const results = await Promise.allSettled(tasks);
  const reasons = results.flatMap((result) =>
    result.status === 'rejected' ? [result.reason] : [],
  );

  if (reasons.length > 0)
    throw new AggregateError(reasons, `${reasons.length} task(s) failed`);

  // Every task is already settled, so this resolves immediately and keeps the tuple types.
  return Promise.all(tasks);
}

export function formatZodError(source: string, error: z.ZodError): string {
  return `${source}\n\n${z.prettifyError(error)}`;
}
