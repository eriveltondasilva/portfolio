import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    env: { RATE_LIMIT_SECRET: 'test-secret' },
    mockReset: true,
    unstubEnvs: true,
  },
});
