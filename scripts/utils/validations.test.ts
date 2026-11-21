import { describe, expect, it } from 'vitest';

import {
  checkAuthorsExist,
  checkSeriesExist,
  checkUniqueSeriesOrder,
  checkUniqueSlugs,
} from './validations';

import type { PostIndex } from '@/types';

describe('checkUniqueSlugs', () => {
  it('should return no errors when all slugs are unique', () => {
    const entries = [
      { slug: 'a', source: 'one.yml' },
      { slug: 'b', source: 'two.yml' },
    ];

    expect(checkUniqueSlugs(entries)).toEqual([]);
  });

  it('should report a duplicated slug with every source that uses it', () => {
    const entries = [
      { slug: 'a', source: 'one.yml' },
      { slug: 'a', source: 'two.yml' },
      { slug: 'b', source: 'three.yml' },
    ];
    const errors = checkUniqueSlugs(entries);

    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain('"a"');
    expect(errors[0]).toContain('one.yml');
    expect(errors[0]).toContain('two.yml');
    expect(errors[0]).not.toContain('three.yml');
  });

  it('should list every duplicated slug in a single error', () => {
    const entries = [
      { slug: 'a', source: 'one.yml' },
      { slug: 'a', source: 'two.yml' },
      { slug: 'b', source: 'three.yml' },
      { slug: 'b', source: 'four.yml' },
    ];
    const errors = checkUniqueSlugs(entries);

    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain('"a"');
    expect(errors[0]).toContain('"b"');
  });
});

describe('checkUniqueSeriesOrder', () => {
  it('should ignore posts that are not part of a series', () => {
    const posts = [
      { slug: 'a', folder: 'folder-a' },
      { slug: 'b', folder: 'folder-b' },
    ] as PostIndex[];

    expect(checkUniqueSeriesOrder(posts)).toEqual([]);
  });

  it('should report posts sharing the same order in the same series', () => {
    const posts = [
      { slug: 'a', folder: 'folder-a', series: 'alpha', order: 1 },
      { slug: 'b', folder: 'folder-b', series: 'alpha', order: 1 },
    ] as PostIndex[];
    const errors = checkUniqueSeriesOrder(posts);

    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain('alpha#1');
    expect(errors[0]).toContain('folder-a');
    expect(errors[0]).toContain('folder-b');
  });

  it('should allow the same order in different series', () => {
    const posts = [
      { slug: 'a', folder: 'folder-a', series: 'alpha', order: 1 },
      { slug: 'b', folder: 'folder-b', series: 'beta', order: 1 },
    ] as PostIndex[];

    expect(checkUniqueSeriesOrder(posts)).toEqual([]);
  });
});

describe('checkSeriesExist', () => {
  it('should return no errors when every referenced series is known', () => {
    const posts = [{ slug: 'a', folder: 'folder-a', series: 'alpha' }] as PostIndex[];

    expect(checkSeriesExist(posts, new Set(['alpha']))).toEqual([]);
  });

  it('should ignore posts without a series', () => {
    const posts = [{ slug: 'a', folder: 'folder-a' }] as PostIndex[];

    expect(checkSeriesExist(posts, new Set<string>())).toEqual([]);
  });

  it('should report a post that references an unknown series and list the known ones', () => {
    const posts = [{ slug: 'a', folder: 'folder-a', series: 'ghost' }] as PostIndex[];
    const errors = checkSeriesExist(posts, new Set(['alpha']));

    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain('"a" -> series "ghost"');
    expect(errors[0]).toContain('Available series: "alpha"');
  });

  it('should say that no series exist when there are no known series', () => {
    const posts = [{ slug: 'a', folder: 'folder-a', series: 'ghost' }] as PostIndex[];

    expect(checkSeriesExist(posts, new Set<string>())[0]).toContain('No series found.');
  });
});

describe('checkAuthorsExist', () => {
  it('should return no errors when every author is known', () => {
    const posts = [{ slug: 'a', folder: 'folder-a', authors: ['erivelton'] }] as PostIndex[];

    expect(checkAuthorsExist(posts, new Set(['erivelton']))).toEqual([]);
  });

  it('should report each unknown author with the post that references it', () => {
    const posts = [
      { slug: 'a', folder: 'folder-a', authors: ['erivelton', 'ghost'] },
      { slug: 'b', folder: 'folder-b', authors: ['phantom'] },
    ] as PostIndex[];
    const errors = checkAuthorsExist(posts, new Set(['erivelton']));

    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain('author "ghost" in "a"');
    expect(errors[0]).toContain('author "phantom" in "b"');
  });

  it('should say that no authors exist when there are no known authors', () => {
    const posts = [{ slug: 'a', folder: 'folder-a', authors: ['ghost'] }] as PostIndex[];

    expect(checkAuthorsExist(posts, new Set<string>())[0]).toContain('No authors found.');
  });
});
