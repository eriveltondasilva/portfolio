import { join } from 'node:path';

import { POST_META_FILE } from '@/lib/constants';
import { POSTS_DIR } from '@/lib/paths';

import type { PostIndex } from '@/types';

interface Entry {
  slug: string;
  source: string;
}

export function getPostMetaPath(post: PostIndex): string {
  return join(POSTS_DIR, post.folder, POST_META_FILE);
}

function findDuplicates<T>(items: readonly T[], keyOf: (item: T) => string) {
  return [...Map.groupBy(items, keyOf)].filter(([, group]) => group.length > 1);
}

function formatAvailable(noun: string, known: ReadonlySet<string>): string {
  if (known.size === 0) return `\n  No ${noun} found.`;

  return `\n  Available ${noun}: ${[...known].map((slug) => `"${slug}"`).join(', ')}`;
}

export function checkUniqueSlugs(entries: readonly Entry[]): string[] {
  const duplicates = findDuplicates(entries, (entry) => entry.slug);

  if (duplicates.length === 0) return [];

  const lines = duplicates.map(([slug, group]) => {
    const sources = group.map((entry) => `\n    - ${entry.source}`).join('');
    return `  "${slug}" found in:${sources}`;
  });

  return [`Duplicate slugs found:\n\n${lines.join('\n')}`];
}

export function checkUniqueSeriesOrder(posts: readonly PostIndex[]): string[] {
  const seriesPosts = posts.filter(
    (post) => post.series !== undefined && post.order !== undefined,
  );
  const duplicates = findDuplicates(
    seriesPosts,
    (post) => `${post.series}#${post.order}`,
  );

  return duplicates.map(([key, group]) => {
    const files = group
      .map((post) => `\n    - ${getPostMetaPath(post)}`)
      .join('');
    return `Duplicate "order" in series (series#order) "${key}":${files}`;
  });
}

export function checkSeriesExist(
  posts: readonly PostIndex[],
  knownSeries: ReadonlySet<string>,
): string[] {
  const invalidPosts = posts.filter(
    (post) => post.series !== undefined && !knownSeries.has(post.series),
  );

  if (invalidPosts.length === 0) return [];

  const detail = invalidPosts
    .map(
      (post) =>
        `  - "${post.slug}" -> series "${post.series}"\n    ${getPostMetaPath(post)}`,
    )
    .join('\n');

  return [
    `Non-existent series referenced:\n${detail}${formatAvailable('series', knownSeries)}`,
  ];
}

export function checkAuthorsExist(
  posts: readonly PostIndex[],
  knownAuthors: ReadonlySet<string>,
): string[] {
  const missing = posts.flatMap((post) =>
    post.authors
      .filter((author) => !knownAuthors.has(author))
      .map((author) => ({ author, post })),
  );

  if (missing.length === 0) return [];

  const detail = missing
    .map(
      ({ author, post }) =>
        `  - author "${author}" in "${post.slug}"\n    ${getPostMetaPath(post)}`,
    )
    .join('\n');

  return [
    `Non-existent authors referenced:\n${detail}${formatAvailable('authors', knownAuthors)}`,
  ];
}
