import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    include: ['src/**/*.test.ts', 'scripts/**/*.test.ts'],
    env: { RATE_LIMIT_SECRET: 'test-secret' },
    //
    environment: 'node',
    isolate: false,
    mockReset: true,
    unstubEnvs: true,
  },
});
