/**
 * Kept out of constants.ts because client components also import that file,
 * and this value depends on server-only env vars, so the client could resolve a different URL.
 */
function resolveBaseUrl(): string {
  const siteUrl = process.env['NEXT_PUBLIC_SITE_URL'];
  if (siteUrl) return siteUrl.replace(/\/+$/, '');

  const vercelUrl = process.env['VERCEL_PROJECT_PRODUCTION_URL'];
  if (vercelUrl) return `https://${vercelUrl}`;

  // Inside a Next.js production build/server, a missing URL would silently ship localhost
  // links in the sitemap and OG images. Build scripts (no NEXT_PHASE) are not affected.
  if (process.env['NODE_ENV'] === 'production' && process.env['NEXT_PHASE']) {
    throw new Error('NEXT_PUBLIC_SITE_URL is not set.');
  }

  return 'http://localhost:3000';
}

export const BASE_URL = resolveBaseUrl();
