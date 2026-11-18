import { getPostsByTag, getPublishedTags } from './posts';

import type { TagCount } from '@/types';

const sortedTags = getPublishedTags().toSorted();
const tagSet = new Set(sortedTags);
const sortedTagsWithCount: TagCount[] = sortedTags
  .map((tag) => ({ tag, count: getPostsByTag(tag).length }))
  .toSorted((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));

// ─────────────────────────────────────

export function getAllTags(): ReadonlyArray<string> {
  return sortedTags;
}

export function getTagsWithCount(): ReadonlyArray<TagCount> {
  return sortedTagsWithCount;
}

export function hasTagPage(tag: string): boolean {
  return tagSet.has(tag);
}
