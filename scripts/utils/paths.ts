import { join } from 'node:path';

// # Directories
const CONTENT_DIR = join(process.cwd(), 'content');
const GENERATED_DIR = join(process.cwd(), 'generated');
const SCHEMAS_DIR = join(GENERATED_DIR, 'schemas');
const INDEXES_DIR = join(GENERATED_DIR, 'indexes');

export const POSTS_DIR = join(CONTENT_DIR, 'posts');

// # Sources
export const AUTHORS_SOURCE_FILE = join(CONTENT_DIR, 'authors.yml');
export const SERIES_SOURCE_FILE = join(CONTENT_DIR, 'series.yml');

// # Schemas
export const AUTHORS_SCHEMA_OUTPUT = join(SCHEMAS_DIR, 'authors.json');
export const SERIES_SCHEMA_OUTPUT = join(SCHEMAS_DIR, 'series.json');
export const POST_SCHEMA_OUTPUT = join(SCHEMAS_DIR, 'post.json');

// # Indexes
export const AUTHORS_INDEX_OUTPUT = join(INDEXES_DIR, 'authors.json');
export const POSTS_INDEX_OUTPUT = join(INDEXES_DIR, 'posts.json');
export const PROJECTS_INDEX_OUTPUT = join(INDEXES_DIR, 'projects.json');
export const SERIES_INDEX_OUTPUT = join(INDEXES_DIR, 'series.json');
