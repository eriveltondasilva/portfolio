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
    process.exitCode = 1;
  }
}
