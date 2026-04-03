import { join } from 'node:path'

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

export enum Topics {
  INCLUDE = 'portfolio',
  FEATURED = 'featured',
  WIP = 'wip',
}

export const GITHUB_REPO = 'https://github.com/eriveltondasilva/portfolio-v3'

export const PRIMARY_AUTHOR_SLUG = 'erivelton'

/**
 *  Cover image convention: always named
 * `cover.jpg` inside the post folder.
 */
export const COVER_NAME = 'cover.jpg'

export const URL_BASE =
  process.env['VERCEL_URL'] ?
    `https://${process.env['VERCEL_URL']}`
  : `http://localhost:3000`

// ###

export const CONTENT_DIR = join(process.cwd(), 'content')
export const GENERATED_DIR = join(process.cwd(), 'generated')

// # Directories
export const AUTHORS_DIR = join(CONTENT_DIR, 'authors')
export const POSTS_DIR = join(CONTENT_DIR, 'posts')
export const SERIES_DIR = join(CONTENT_DIR, 'series')

export const SCHEMAS_DIR = join(GENERATED_DIR, 'schemas')
export const INDEXES_DIR = join(GENERATED_DIR, 'indexes')

// # Files
export const AUTHORS_SOURCE_FILE = join(AUTHORS_DIR, 'index.json')
export const SERIES_SOURCE_FILE = join(SERIES_DIR, 'index.json')

// # Schemas
export const AUTHORS_SCHEMA_OUTPUT = join(SCHEMAS_DIR, 'authors.json')
export const SERIES_SCHEMA_OUTPUT = join(SCHEMAS_DIR, 'series.json')
export const POSTS_SCHEMA_OUTPUT = join(SCHEMAS_DIR, 'posts.json')

// # Indexes
export const POSTS_INDEX_OUTPUT = join(INDEXES_DIR, 'posts.json')
export const PROJECTS_INDEX_OUTPUT = join(INDEXES_DIR, 'projects.json')
export const SERIES_INDEX_OUTPUT = join(INDEXES_DIR, 'series.json')
