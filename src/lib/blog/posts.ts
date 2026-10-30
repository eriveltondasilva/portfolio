import { PostStatus } from '@/lib/constants';
import postsIndex from '@/generated/indexes/posts.json';

import type { AdjacentPosts, PostIndex } from '@/types';

// Resolved once per module instance instead of on every call.
const allPosts = postsIndex as PostIndex[];
const publishedPosts = allPosts.filter(
  (post) => post.status === PostStatus.PUBLISHED,
);
const postsBySlug = new Map(allPosts.map((post) => [post.slug, post]));

export function getAllPosts(): PostIndex[] {
  return [...publishedPosts];
}

export function getAllPostSlugs(): Array<{ slug: string }> {
  return allPosts.map(({ slug }) => ({ slug }));
}

/** Includes archived posts, which stay reachable by URL but are not listed. */
export function getPostBySlug(slug: string): PostIndex | null {
  return postsBySlug.get(slug) ?? null;
}

export function getRecentPosts(limit = 4): PostIndex[] {
  return publishedPosts.slice(0, limit);
}

export function getPostsByTag(tag: string): PostIndex[] {
  return publishedPosts.filter((post) => post.tags.includes(tag));
}

export function getPostsByAuthor(authorSlug: string): PostIndex[] {
  return publishedPosts.filter((post) => post.authors.includes(authorSlug));
}

/** Posts of a series in reading order. Archived posts stay part of the series. */
export function getSeriesPosts(seriesSlug: string): PostIndex[] {
  return allPosts
    .filter((post) => post.series === seriesSlug)
    .toSorted((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export function getRelatedPosts(slug: string, limit = 3): PostIndex[] {
  const post = postsBySlug.get(slug);

  if (!post) return [];

  const tags = new Set(post.tags);

  return publishedPosts
    .filter((other) => other.slug !== slug)
    .map((other) => ({
      other,
      score: other.tags.filter((tag) => tags.has(tag)).length,
    }))
    .filter(({ score }) => score > 0)
    .toSorted((a, b) => b.score - a.score) // stable: ties keep the newest-first order
    .slice(0, limit)
    .map(({ other }) => other);
}

export function getAdjacentPosts(slug: string): AdjacentPosts {
  const index = publishedPosts.findIndex((post) => post.slug === slug);

  if (index === -1) return { prevPost: null, nextPost: null };

  return {
    prevPost: publishedPosts[index + 1] ?? null,
    nextPost: publishedPosts[index - 1] ?? null,
  };
}
