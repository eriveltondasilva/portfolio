import * as logger from './logger';

export async function runScript(title: string, main: () => Promise<void>): Promise<void> {
  const startedAt = performance.now();

  logger.divider();
  console.info(`⏳ ${title}...`);

  try {
    await main();

    logger.success(`✅ Done in ${(performance.now() - startedAt).toFixed(0)}ms`);
    logger.divider();
  } catch (error) {
    logger.failure(error);
    process.exitCode = 1;
  }
}
