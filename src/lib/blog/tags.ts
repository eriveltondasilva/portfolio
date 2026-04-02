import { getAllPosts } from './posts'

import type { TagCount } from '@/types'

function buildTagCounts(): Record<string, number> {
  return getAllPosts()
    .flatMap((post) => post.tags)
    .reduce<Record<string, number>>((acc, tag) => {
      acc[tag] = (acc[tag] ?? 0) + 1
      return acc
    }, {})
}

export function getAllTags(): string[] {
  return Object.keys(buildTagCounts()).toSorted()
}

export function getTagsWithCount(): TagCount[] {
  return Object.entries(buildTagCounts())
    .map(([tag, count]) => ({ tag, count }))
    .toSorted((a, b) => b.count - a.count)
}
