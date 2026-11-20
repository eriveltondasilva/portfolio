import 'server-only';

import postsIndex from '@/generated/indexes/posts.json';
import { PostStatus } from '@/lib/constants';

import type { AdjacentPosts, PostIndex } from '@/types';

function groupPostsByTag(posts: PostIndex[]): Map<string, PostIndex[]> {
  const grouped = new Map<string, PostIndex[]>();

  for (const post of posts) {
    for (const tag of post.tags) {
      const postsWithTag = grouped.get(tag);

      if (postsWithTag) {
        postsWithTag.push(post);
      } else {
        grouped.set(tag, [post]);
      }
    }
  }

  return grouped;
}

function groupPostsBySeries(posts: PostIndex[]): Map<string, PostIndex[]> {
  const grouped = new Map<string, PostIndex[]>();

  for (const post of posts) {
    if (!post.series) continue;

    const postsInSeries = grouped.get(post.series);

    if (postsInSeries) {
      postsInSeries.push(post);
    } else {
      grouped.set(post.series, [post]);
    }
  }

  for (const seriesPosts of grouped.values()) {
    seriesPosts.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }

  return grouped;
}

// ─────────────────────────────────────

const allPosts = postsIndex as PostIndex[];
const publishedPosts = allPosts.filter((post) => post.status === PostStatus.PUBLISHED);

const postsBySlug = new Map(allPosts.map((post) => [post.slug, post]));
const publishedIndexBySlug = new Map(publishedPosts.map((post, index) => [post.slug, index]));

const postsByTag = groupPostsByTag(publishedPosts);
const postsBySeries = groupPostsBySeries(allPosts);

const publishedTags: readonly string[] = [...postsByTag.keys()];

// ─────────────────────────────────────

export function getAllPosts(): ReadonlyArray<PostIndex> {
  return publishedPosts;
}

interface PostSlug {
  slug: string;
}

export function getAllPostSlugs(): PostSlug[] {
  return allPosts.map((post) => ({ slug: post.slug }));
}

export function getPostBySlug(slug: string): Readonly<PostIndex> | null {
  return postsBySlug.get(slug) ?? null;
}

export function getRecentPosts(limit = 4): ReadonlyArray<PostIndex> {
  return publishedPosts.slice(0, limit);
}

export function getPublishedTags(): ReadonlyArray<string> {
  return publishedTags;
}

export function getPostsByTag(tag: string): ReadonlyArray<PostIndex> {
  return postsByTag.get(tag) ?? [];
}

export function getSeriesPosts(seriesSlug: string): ReadonlyArray<PostIndex> {
  return postsBySeries.get(seriesSlug) ?? [];
}

export function getRelatedPosts(slug: string, limit = 3): ReadonlyArray<PostIndex> {
  const post = postsBySlug.get(slug);

  if (!post) return [];

  const scores = new Map<PostIndex, number>();

  for (const tag of post.tags) {
    for (const otherPost of postsByTag.get(tag) ?? []) {
      if (otherPost.slug !== slug) {
        scores.set(otherPost, (scores.get(otherPost) ?? 0) + 1);
      }
    }
  }

  // Ties keep the published order, as the previous stable sort did
  return [...scores]
    .toSorted(([a, scoreA], [b, scoreB]) => {
      return (
        scoreB - scoreA ||
        (publishedIndexBySlug.get(a.slug) ?? 0) - (publishedIndexBySlug.get(b.slug) ?? 0)
      );
    })
    .slice(0, limit)
    .map(([other]) => other);
}

export function getAdjacentPosts(slug: string): Readonly<AdjacentPosts> {
  const index = publishedIndexBySlug.get(slug);

  if (index === undefined) return { prevPost: null, nextPost: null };

  return {
    prevPost: publishedPosts[index + 1] ?? null,
    nextPost: publishedPosts[index - 1] ?? null,
  };
}
