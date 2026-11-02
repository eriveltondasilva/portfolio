import { Redis } from '@upstash/redis';

export const redis = Redis.fromEnv();

// VERCEL_ENV is "production", "preview" or "development" on Vercel and unset elsewhere,
// so local runs and previews get their own keys instead of writing into production data
const ENVIRONMENT = process.env['VERCEL_ENV'] ?? 'local';

export function namespaceKey(key: string): string {
  return `${ENVIRONMENT}:${key}`;
}
