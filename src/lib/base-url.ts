/**
 * Kept out of constants.ts because client components also import that file,
 * and this value depends on server-only env vars, so the client could resolve a different URL.
 */
function resolveBaseUrl(): string {
  const siteUrl = process.env['SITE_URL'];
  if (siteUrl) return siteUrl.replace(/\/+$/, '');

  const vercelUrl = process.env['VERCEL_PROJECT_PRODUCTION_URL'];
  if (vercelUrl) return `https://${vercelUrl}`;

  // A missing URL in production would silently ship localhost links in the sitemap and OG images.
  if (process.env['NODE_ENV'] === 'production') {
    throw new Error('NEXT_PUBLIC_SITE_URL is not set.');
  }

  return 'http://localhost:3000';
}

export const BASE_URL = resolveBaseUrl();
