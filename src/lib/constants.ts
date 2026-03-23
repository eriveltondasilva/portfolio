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

export const GITHUB_REPO = 'https://github.com/eriveltondasilva/portfolio-v3'

export const PRIMARY_AUTHOR_SLUG = 'erivelton'

// ###

export const CONTENT_DIR = join(process.cwd(), 'content')

export const POSTS_DIR = join(CONTENT_DIR, 'posts')
export const SERIES_DIR = join(CONTENT_DIR, 'series')
export const SCHEMAS_DIR = join(CONTENT_DIR, 'schemas')
export const INDEXES_DIR = join(CONTENT_DIR, 'indexes')

export const AUTHORS_FILE = join(CONTENT_DIR, 'authors.json')

export const AUTHORS_SCHEMA_OUTPUT = join(SCHEMAS_DIR, 'authors.json')
export const SERIES_SCHEMA_OUTPUT = join(SCHEMAS_DIR, 'series.json')

export const POSTS_INDEX_OUTPUT = join(INDEXES_DIR, 'posts.json')
export const PROJECTS_INDEX_OUTPUT = join(INDEXES_DIR, 'projects.json')
export const SERIES_INDEX_OUTPUT = join(INDEXES_DIR, 'series.json')
