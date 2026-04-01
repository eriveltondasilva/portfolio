import { getAllPosts } from '@/lib/blog/posts'
import { URL_BASE } from '@/lib/constants'

import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts()

  return [
    {
      url: URL_BASE,
      lastModified: new Date(),
      changeFrequency: 'yearly',
    },
    {
      url: `${URL_BASE}/blog`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
    },
    {
      url: `${URL_BASE}/tags`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
    },
    {
      url: `${URL_BASE}/series`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
    },
    {
      url: `${URL_BASE}/projects`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
    },
    ...posts.map((post) => ({
      url: `${URL_BASE}/blog/${post.slug}`,
      lastModified: new Date(post.publishedAt),
    })),
  ]
}
