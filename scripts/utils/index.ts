import { log } from './logger';

export async function runScript(
  title: string,
  main: () => Promise<void>,
): Promise<void> {
  const startedAt = performance.now();

  log.divider();
  console.info(`⏳ ${title}...`);

  try {
    await main();

    log.success(`✅ Done in ${(performance.now() - startedAt).toFixed(0)}ms`);
    log.divider();
  } catch (error) {
    log.failure(error);
    // exitCode (instead of process.exit) lets pending I/O finish.
    process.exitCode = 1;
  }
}

export function sortByDateDesc<T extends { publishedAt: string; slug: string }>(
  items: readonly T[],
): T[] {
  // ISO dates sort lexicographically. The slug tiebreaker keeps the order
  // independent of the filesystem scan order.
  return items.toSorted(
    (a, b) =>
      b.publishedAt.localeCompare(a.publishedAt) ||
      a.slug.localeCompare(b.slug),
  );
}
