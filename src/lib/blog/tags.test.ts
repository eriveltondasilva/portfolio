import { describe, expect, it, vi } from 'vitest';

import { getAllTags, getTagsWithCount, hasTagPage } from './tags';

const { postsByTag } = vi.hoisted(() => ({
  postsByTag: { ts: [1], react: [1, 2, 3], nextjs: [1] } as Record<string, number[]>,
}));

vi.mock('./posts', () => ({
  getPublishedTags: () => ['ts', 'react', 'nextjs'],
  getPostsByTag: (tag: string) => postsByTag[tag] ?? [],
}));

describe('getAllTags', () => {
  it('should return the tags sorted alphabetically', () => {
    expect(getAllTags()).toEqual(['nextjs', 'react', 'ts']);
  });
});

describe('getTagsWithCount', () => {
  it('should sort by count descending and break ties alphabetically', () => {
    expect(getTagsWithCount()).toEqual([
      { tag: 'react', count: 3 },
      { tag: 'nextjs', count: 1 },
      { tag: 'ts', count: 1 },
    ]);
  });
});

describe('hasTagPage', () => {
  it('should return true for a published tag', () => {
    expect(hasTagPage('react')).toBe(true);
  });

  it('should return false for an unknown tag', () => {
    expect(hasTagPage('vue')).toBe(false);
  });
});
