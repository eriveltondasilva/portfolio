// Pure constants only: this module is bundled into client components,
// so it must not import Node APIs. Filesystem paths live in `paths.ts`.

export enum PostStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

export enum SeriesStatus {
  PLANNED = 'planned',
  IN_PROGRESS = 'in-progress',
  COMPLETE = 'complete',
}

export enum ProjectStatus {
  ACTIVE = 'active',
  WIP = 'wip',
  ARCHIVED = 'archived',
}

export enum GithubTopic {
  INCLUDE = 'portfolio',
  FEATURED = 'featured',
  WIP = 'wip',
}

// -------------------------------------

export const PRIMARY_AUTHOR_SLUG = 'erivelton';
export const LOCALE = 'pt-BR';

export const GITHUB_REPO = 'https://github.com/eriveltondasilva/portfolio';

// # Files inside each post folder
export const POST_META_FILE = 'meta.yml';
export const POST_CONTENT_FILE = 'index.mdx';
export const POST_IMAGES_DIR = 'images';

// -------------------------------------

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
