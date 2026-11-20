import { describe, expect, it, vi } from 'vitest';

import {
  getAdjacentPosts,
  getAllPosts,
  getAllPostSlugs,
  getPostBySlug,
  getPostsByTag,
  getPublishedTags,
  getRecentPosts,
  getRelatedPosts,
  getSeriesPosts,
} from './posts';

const { posts } = vi.hoisted(() => ({
  posts: [
    { slug: 'newest', status: 'published', tags: ['react', 'nextjs'], series: 'alpha', order: 2 },
    { slug: 'middle', status: 'published', tags: ['react'] },
    { slug: 'archived-post', status: 'archived', tags: ['legacy'], series: 'alpha', order: 3 },
    { slug: 'older', status: 'published', tags: ['react', 'nextjs', 'ts'] },
    { slug: 'oldest', status: 'published', tags: ['ts'] },
  ],
}));

vi.mock('server-only', () => ({}));
vi.mock('@/generated/indexes/posts.json', () => ({ default: posts }));

const slugsOf = (list: ReadonlyArray<{ slug: string }>) => list.map((post) => post.slug);

describe('getAllPosts', () => {
  it('should return only published posts keeping the index order', () => {
    expect(slugsOf(getAllPosts())).toEqual(['newest', 'middle', 'older', 'oldest']);
  });
});

describe('getAllPostSlugs', () => {
  it('should include archived posts', () => {
    expect(getAllPostSlugs().map(({ slug }) => slug)).toEqual([
      'newest',
      'middle',
      'archived-post',
      'older',
      'oldest',
    ]);
  });
});

describe('getPostBySlug', () => {
  it('should find a post regardless of its status', () => {
    expect(getPostBySlug('archived-post')?.status).toBe('archived');
  });

  it('should return null when the slug does not exist', () => {
    expect(getPostBySlug('missing')).toBeNull();
  });
});

describe('getRecentPosts', () => {
  it('should return all published posts when under the default limit', () => {
    expect(slugsOf(getRecentPosts())).toEqual(['newest', 'middle', 'older', 'oldest']);
  });

  it('should respect a custom limit', () => {
    expect(slugsOf(getRecentPosts(2))).toEqual(['newest', 'middle']);
  });
});

describe('getPublishedTags', () => {
  it('should list tags in order of first appearance', () => {
    expect(getPublishedTags()).toEqual(['react', 'nextjs', 'ts']);
  });

  it('should not expose tags that only exist on drafts or archived posts', () => {
    expect(getPublishedTags()).not.toContain('secret');
    expect(getPublishedTags()).not.toContain('legacy');
  });
});

describe('getPostsByTag', () => {
  it('should return only published posts that have the tag', () => {
    expect(slugsOf(getPostsByTag('react'))).toEqual(['newest', 'middle', 'older']);
  });

  it('should return an empty list for an unknown tag', () => {
    expect(getPostsByTag('unknown')).toEqual([]);
  });
});

describe('getSeriesPosts', () => {
  it('should sort the posts of a series by order including non published ones', () => {
    expect(slugsOf(getSeriesPosts('alpha'))).toEqual(['newest', 'archived-post']);
  });

  it('should return an empty list for an unknown series', () => {
    expect(getSeriesPosts('unknown')).toEqual([]);
  });
});

describe('getRelatedPosts', () => {
  it('should rank posts by the number of shared tags', () => {
    expect(slugsOf(getRelatedPosts('newest'))).toEqual(['older', 'middle']);
  });

  it('should break ties using the published order', () => {
    expect(slugsOf(getRelatedPosts('middle'))).toEqual(['newest', 'older']);
  });

  it('should never include the post itself nor drafts', () => {
    expect(slugsOf(getRelatedPosts('older'))).not.toContain('older');
  });

  it('should respect the limit', () => {
    expect(slugsOf(getRelatedPosts('newest', 1))).toEqual(['older']);
  });

  it('should return an empty list when the slug does not exist', () => {
    expect(getRelatedPosts('missing')).toEqual([]);
  });
});

describe('getAdjacentPosts', () => {
  it('should return the older post as previous and the newer one as next', () => {
    const { prevPost, nextPost } = getAdjacentPosts('middle');

    expect([prevPost?.slug, nextPost?.slug]).toEqual(['older', 'newest']);
  });

  it('should have no next post for the newest one', () => {
    expect(getAdjacentPosts('newest').nextPost).toBeNull();
  });

  it('should have no previous post for the oldest one', () => {
    expect(getAdjacentPosts('oldest').prevPost).toBeNull();
  });

  it('should return no neighbors for a post that is not published', () => {
    expect(getAdjacentPosts('no-post')).toEqual({ prevPost: null, nextPost: null });
  });
});
