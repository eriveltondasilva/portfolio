import { BASE_URL } from '@/lib/constants'
import { getAllPosts } from '@/lib/blog/posts'

import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts()

  return posts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: post.updatedAt ?? post.publishedAt,
    changeFrequency: 'yearly',
  }))
}
