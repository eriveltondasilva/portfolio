import { getAllSeries } from '@/lib/blog/series'
import { BASE_URL } from '@/lib/constants'

import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const series = getAllSeries()
  const lastModified = new Date()

  return series.map((s) => ({
    url: `${BASE_URL}/series/${s.slug}`,
    changeFrequency: 'yearly',
    lastModified,
  }))
}
