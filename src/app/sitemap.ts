import { getAllPosts } from '@/lib/blog/posts';
import { getAllSeries } from '@/lib/blog/series';
import { getAllTags } from '@/lib/blog/tags';
import { BASE_URL } from '@/lib/constants';

import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();

  const lastPostChange = posts
    .map((post) => post.updatedAt ?? post.publishedAt)
    .toSorted()
    .at(-1);

  return [
    // # Pages
    { url: BASE_URL },
    {
      url: `${BASE_URL}/blog`,
      ...(lastPostChange ? { lastModified: lastPostChange } : {}),
    },
    { url: `${BASE_URL}/privacy` },
    { url: `${BASE_URL}/projects` },
    { url: `${BASE_URL}/series` },
    { url: `${BASE_URL}/tags` },
    // # Series
    ...getAllSeries().map(({ slug }) => ({
      url: `${BASE_URL}/series/${slug}`,
    })),
    // # Tags
    ...getAllTags().map((tag) => ({ url: `${BASE_URL}/tags/${tag}` })),
    // # Posts
    ...posts.map((post) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: post.updatedAt ?? post.publishedAt,
    })),
  ];
}
