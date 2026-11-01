export const PostStatus = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
} as const;
export type PostStatus = (typeof PostStatus)[keyof typeof PostStatus];

export const SeriesStatus = {
  PLANNED: 'planned',
  IN_PROGRESS: 'in-progress',
  COMPLETE: 'complete',
} as const;
export type SeriesStatus = (typeof SeriesStatus)[keyof typeof SeriesStatus];

export const ProjectStatus = {
  ACTIVE: 'active',
  WIP: 'wip',
  ARCHIVED: 'archived',
} as const;
export type ProjectStatus = (typeof ProjectStatus)[keyof typeof ProjectStatus];

export const GithubTopic = {
  INCLUDE: 'portfolio',
  FEATURED: 'featured',
  WIP: 'wip',
} as const;
export type GithubTopic = (typeof GithubTopic)[keyof typeof GithubTopic];

// -------------------------------------

export const SITE_NAME = "Erivelton's Portfolio";
export const TWITTER_HANDLE = '@erivelton_silv4';
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
