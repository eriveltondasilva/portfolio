import { getAllPosts } from './posts';

import type { TagCount } from '@/types';

/* A Map (not a plain object) so tags like "constructor" cannot collide with Object.prototype. */
function buildTagCounts(): Map<string, number> {
  const counts = new Map<string, number>();

  for (const post of getAllPosts()) {
    for (const tag of post.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }

  return counts;
}

// Resolved once per module instance: TagLink checks every tag it renders.
const tagCounts = buildTagCounts();

export function getAllTags(): string[] {
  return [...tagCounts.keys()].toSorted();
}

export function getTagsWithCount(): TagCount[] {
  return [...tagCounts]
    .map(([tag, count]) => ({ tag, count }))
    .toSorted((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

export function hasTagPage(tag: string): boolean {
  return tagCounts.has(tag);
}
