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

export const SERIES_STATUS_LABEL = {
  [SeriesStatus.PLANNED]: 'Planejada',
  [SeriesStatus.IN_PROGRESS]: 'Em andamento',
  [SeriesStatus.COMPLETE]: 'Completa',
} as const satisfies Record<SeriesStatus, string>;

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

// ─────────────────────────────────────

export const SITE_NAME = "Erivelton's Portfolio";
export const SITE_DESCRIPTION =
  'Desenvolvedor Frontend apaixonado por React, Next.js e TypeScript. Artigos sobre frontend moderno e boas práticas.';

export const AUTHOR_NAME = 'Erivelton Silva';
export const AUTHOR_PRONOUNS = 'ele/dele';
export const AUTHOR_LOCATION = 'Alagoas, Brasil';

export const TWITTER_HANDLE = '@erivelton_silv4';
export const PRIMARY_AUTHOR_SLUG = 'erivelton';

export const GITHUB_REPO = 'https://github.com/eriveltondasilva/portfolio';

export const LOCALE = 'pt-BR';
export const OG_LOCALE = LOCALE.replace('-', '_');

// # Files inside each post folder
export const POST_META_FILE = 'meta.yml';
export const POST_CONTENT_FILE = 'index.mdx';
export const POST_IMAGES_DIR = 'images';

// # Giscus
export const GISCUS = {
  repo: 'eriveltondasilva/portfolio',
  repoId: 'R_kgDORkGhhA',
  category: 'Comments',
  categoryId: 'DIC_kwDORkGhhM4DKR_m',
} as const;
