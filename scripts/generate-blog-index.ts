import { readdir } from 'node:fs/promises';
import { join } from 'node:path';

import { file as bunFile } from 'bun';
import getReadingTime from 'reading-time';

import { postSchema } from '@/lib/schemas';
import { POST_CONTENT_FILE, POST_META_FILE, PostStatus } from '@/lib/constants';

import {
  AUTHORS_INDEX_OUTPUT,
  POSTS_DIR,
  POSTS_INDEX_OUTPUT,
  SERIES_INDEX_OUTPUT,
} from './utils/paths';
import { runScript } from './utils/run-script';
import { readAuthors, readSeries } from './utils/content';
import { formatZodError, getErrorMessage, resolveAll, throwIfErrors } from './utils/errors';
import * as logger from './utils/logger';
import { inspectPostAssets } from './utils/post-assets';
import {
  checkAuthorsExist,
  checkSeriesExist,
  checkUniqueSeriesOrder,
  checkUniqueSlugs,
  getPostMetaPath,
} from './utils/validations';
import { readYaml, writeJson } from './utils/files';

import type { PostIndex, Series, SeriesIndex, SeriesPostRef } from '@/types';

type SeriesPost = PostIndex & { series: string; order: number };

interface ParsedPost {
  post: PostIndex;
  warnings: string[];
}

interface PostsData {
  posts: PostIndex[];
  warnings: string[];
  stats: {
    scanned: number;
    published: number;
    archived: number;
    drafts: number;
    withCover: number;
  };
}

// # Readers

async function listPostFolders(): Promise<string[]> {
  const entries = await readdir(POSTS_DIR, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith('.'))
    .map((entry) => entry.name)
    .toSorted();
}

async function parsePostFolder(folder: string): Promise<ParsedPost | null> {
  const folderPath = join(POSTS_DIR, folder);
  const metaPath = join(folderPath, POST_META_FILE);
  const contentPath = join(folderPath, POST_CONTENT_FILE);

  const files = [
    { name: POST_META_FILE, path: metaPath },
    { name: POST_CONTENT_FILE, path: contentPath },
  ];
  const exists = await Promise.all(files.map(({ path }) => bunFile(path).exists()));
  const missing = files.filter((_, index) => !exists[index]).map(({ name }) => name);

  if (missing.length > 0) {
    throw new Error(`${folderPath}\n\n  Missing file(s): ${missing.join(', ')}`);
  }

  const [meta, content] = await Promise.all([readYaml(metaPath), bunFile(contentPath).text()]);

  if (content.trimStart().startsWith('---')) {
    throw new Error(`${contentPath}\n\n  Frontmatter found in MDX. Move it to ${POST_META_FILE}.`);
  }

  const result = postSchema.safeParse(meta);

  if (!result.success) throw new Error(formatZodError(metaPath, result.error));

  const assets = await inspectPostAssets(folderPath, content);

  if (assets.errors.length > 0) {
    const lines = assets.errors.map((error) => `  - ${error}`).join('\n');
    throw new Error(`${folderPath}\n\n${lines}`);
  }

  if (result.data.status === PostStatus.DRAFT) return null;

  return {
    post: {
      ...result.data,
      folder,
      coverFile: assets.coverFile,
      readingTime: Math.ceil(getReadingTime(content).minutes),
    },
    warnings: assets.warnings.map((warning) => `${folder}: ${warning}`),
  };
}

async function readPosts(): Promise<PostsData> {
  const folders = await listPostFolders();
  const results = await Promise.allSettled(folders.map((folder) => parsePostFolder(folder)));

  throwIfErrors(
    'posts',
    results.flatMap((result) =>
      result.status === 'rejected' ? [getErrorMessage(result.reason)] : [],
    ),
  );

  const parsed = results.flatMap((result) =>
    result.status === 'fulfilled' && result.value ? [result.value] : [],
  );
  const posts = parsed.map(({ post }) => post);
  const published = posts.filter((post) => post.status === PostStatus.PUBLISHED);

  return {
    posts,
    warnings: parsed.flatMap(({ warnings }) => warnings),
    stats: {
      scanned: folders.length,
      published: published.length,
      archived: posts.filter((post) => post.status === PostStatus.ARCHIVED).length,
      drafts: folders.length - posts.length,
      withCover: published.filter((post) => post.coverFile !== null).length,
    },
  };
}

// # Builders

function sortByDateDesc<T extends { publishedAt: string; slug: string }>(items: readonly T[]): T[] {
  return items.toSorted(
    (a, b) => b.publishedAt.localeCompare(a.publishedAt) || a.slug.localeCompare(b.slug),
  );
}

function buildSeriesIndex(series: readonly Series[], posts: readonly PostIndex[]): SeriesIndex[] {
  const seriesPosts = posts.filter(
    (post): post is SeriesPost => post.series !== undefined && post.order !== undefined,
  );
  const postsBySeries = Map.groupBy(seriesPosts, (post) => post.series);

  return sortByDateDesc(series).map((item) => {
    const orderedPosts = (postsBySeries.get(item.slug) ?? []).toSorted((a, b) => a.order - b.order);

    return {
      ...item,
      readingTime: orderedPosts.reduce((total, post) => total + post.readingTime, 0),
      posts: orderedPosts.map(({ slug, title, order }): SeriesPostRef => ({
        slug,
        title,
        order,
      })),
    };
  });
}

// # Main

async function main(): Promise<void> {
  logger.section('Reading content');

  const [authors, series, { posts, warnings, stats }] = await resolveAll(
    readAuthors(),
    readSeries(),
    readPosts(),
  );

  logger.ok('authors:', `${authors.length} loaded`);
  logger.ok('series:', `${series.length} loaded`);
  logger.ok('posts:', `${stats.published} published of ${stats.scanned} scanned`);

  if (stats.archived > 0) logger.skip('archived:', `${stats.archived} archived`);
  if (stats.drafts > 0) logger.skip('drafts:', `${stats.drafts} skipped`);
  if (stats.withCover < stats.published) {
    logger.warn(
      'cover:',
      `${stats.published - stats.withCover} of ${stats.published} published post(s) without cover`,
    );
  }

  logger.section('Validating');

  throwIfErrors('posts', [
    ...checkUniqueSlugs(posts.map((post) => ({ slug: post.slug, source: getPostMetaPath(post) }))),
    ...checkSeriesExist(posts, new Set(series.map(({ slug }) => slug))),
    ...checkUniqueSeriesOrder(posts),
    ...checkAuthorsExist(posts, new Set(authors.map(({ slug }) => slug))),
  ]);

  if (series.length > 0) {
    logger.ok('series exist:', 'all referenced series are defined');
    logger.ok('series order:', 'all posts have unique order');
  }

  if (authors.length > 0) logger.ok('authors exist:', 'all referenced authors are defined');

  logger.ok('assets:', 'folder structure, image names and references are valid');

  for (const warning of warnings) logger.warn('assets:', warning);

  const linkedToSeries = posts.filter((post) => post.series !== undefined).length;

  if (linkedToSeries > 0) {
    logger.detail(`${linkedToSeries} of ${posts.length} post(s) linked to series`);
  }

  logger.section('Writing indices');

  const seriesIndex = buildSeriesIndex(series, posts);

  await Promise.all([
    writeJson(AUTHORS_INDEX_OUTPUT, authors),
    writeJson(POSTS_INDEX_OUTPUT, sortByDateDesc(posts)),
    writeJson(SERIES_INDEX_OUTPUT, seriesIndex),
  ]);

  logger.ok('authors index:', AUTHORS_INDEX_OUTPUT);
  logger.ok('posts index:', POSTS_INDEX_OUTPUT);
  logger.ok('series index:', SERIES_INDEX_OUTPUT);

  for (const { slug, posts: seriesPostRefs } of seriesIndex) {
    if (seriesPostRefs.length === 0) continue;
    logger.detail(`${slug}  (${seriesPostRefs.length} posts)`);
  }
}

await runScript('Generating blog indices', main);
