import { getAllTags } from '@/lib/blog/tags'
import { BASE_URL } from '@/lib/constants'

import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const tags = getAllTags()
  const lastModified = new Date()

  return tags.map((tag) => ({
    url: `${BASE_URL}/tags/${tag}`,
    changeFrequency: 'yearly',
    lastModified,
  }))
}
