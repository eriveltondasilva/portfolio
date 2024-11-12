import { type MetadataRoute } from 'next'

import { getPosts } from '@/services/post-service'
import { url, routes } from '@/config'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts()
  const currentDate = new Date().toISOString().split('T')[0]

  const staticRoutes: MetadataRoute.Sitemap = Object.values(routes).map((route) => ({
    url: url.site + route,
    lastModified: currentDate,
  }))

  const postRoutes = posts.map((post) => ({
    url: `${url.site}/blog/${post.slug}`,
    lastModified: post.updatedAt,
  }))

  return [...staticRoutes, ...postRoutes]
}
