import { type MetadataRoute } from 'next'

import { getAllPosts } from '@/services/post-service'
import { url, routes } from '@/config'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts()
  const currentDate = new Date().toISOString().split('T')[0]

  const staticRoutes: MetadataRoute.Sitemap = Object.values(routes).map(
    (route) => ({
      url: url.site + route,
      lastModified: currentDate,
    }),
  )

  const postRoutes = posts.map((post) => ({
    url: `${url.site}/blog/${post?.slug}`,
    lastModified: post?.updatedAt,
  }))

  return [...staticRoutes, ...postRoutes]
}
