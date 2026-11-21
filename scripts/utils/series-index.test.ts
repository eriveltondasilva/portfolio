import { describe, expect, it } from 'vitest';

import { buildSeriesIndex, sortByDateDesc } from './series-index';

import type { PostIndex, Series } from '@/types';

describe('sortByDateDesc', () => {
  it('should put the most recent item first', () => {
    const items = [
      { slug: 'a', publishedAt: '2026-01-01' },
      { slug: 'b', publishedAt: '2026-03-01' },
    ];

    expect(sortByDateDesc(items).map((item) => item.slug)).toEqual(['b', 'a']);
  });

  it('should break date ties alphabetically by slug', () => {
    const items = [
      { slug: 'b', publishedAt: '2026-01-01' },
      { slug: 'a', publishedAt: '2026-01-01' },
    ];

    expect(sortByDateDesc(items).map((item) => item.slug)).toEqual(['a', 'b']);
  });

  it('should not mutate the given list', () => {
    const items = [
      { slug: 'a', publishedAt: '2026-01-01' },
      { slug: 'b', publishedAt: '2026-03-01' },
    ];

    sortByDateDesc(items);

    expect(items.map((item) => item.slug)).toEqual(['a', 'b']);
  });
});

describe('buildSeriesIndex', () => {
  it('should sum the reading time of the posts in the series', () => {
    const series = [{ slug: 'alpha', publishedAt: '2026-01-01' }] as Series[];
    const posts = [
      { slug: 'p1', title: 'One', series: 'alpha', order: 1, readingTime: 3 },
      { slug: 'p2', title: 'Two', series: 'alpha', order: 2, readingTime: 5 },
    ] as PostIndex[];

    expect(buildSeriesIndex(series, posts)[0]?.readingTime).toBe(8);
  });

  it('should list the posts by order as slim references', () => {
    const series = [{ slug: 'alpha', publishedAt: '2026-01-01' }] as Series[];
    const posts = [
      { slug: 'p2', title: 'Two', series: 'alpha', order: 2, readingTime: 5, tags: ['x'] },
      { slug: 'p1', title: 'One', series: 'alpha', order: 1, readingTime: 3, tags: ['x'] },
    ] as PostIndex[];

    expect(buildSeriesIndex(series, posts)[0]?.posts).toEqual([
      { slug: 'p1', title: 'One', order: 1 },
      { slug: 'p2', title: 'Two', order: 2 },
    ]);
  });

  it('should only include posts that belong to the series', () => {
    const series = [{ slug: 'alpha', publishedAt: '2026-01-01' }] as Series[];
    const posts = [
      { slug: 'in-alpha', series: 'alpha', order: 1, readingTime: 1 },
      { slug: 'in-beta', series: 'beta', order: 1, readingTime: 1 },
      { slug: 'standalone', readingTime: 1 },
    ] as PostIndex[];

    const [alpha] = buildSeriesIndex(series, posts);

    expect(alpha?.posts.map((post) => post.slug)).toEqual(['in-alpha']);
  });

  it('should return zero reading time and no posts for a series without posts', () => {
    const series = [{ slug: 'alpha', publishedAt: '2026-01-01' }] as Series[];

    expect(buildSeriesIndex(series, [])[0]).toMatchObject({ readingTime: 0, posts: [] });
  });

  it('should keep the original fields of the series', () => {
    const series = [{ slug: 'alpha', title: 'Alpha', publishedAt: '2026-01-01' }] as Series[];

    expect(buildSeriesIndex(series, [])[0]).toMatchObject({ slug: 'alpha', title: 'Alpha' });
  });

  it('should order the series by publication date, newest first', () => {
    const series = [
      { slug: 'old', publishedAt: '2026-01-01' },
      { slug: 'new', publishedAt: '2026-05-01' },
    ] as Series[];

    expect(buildSeriesIndex(series, []).map((item) => item.slug)).toEqual(['new', 'old']);
  });
});
