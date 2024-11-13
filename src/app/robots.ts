import type { MetadataRoute } from 'next'

import { url } from '@/config'

export default function robots(): MetadataRoute.Robots {
  const rules = [
    {
      userAgent: '*',
      allow: '/',
    },
  ]

  return {
    rules,
    sitemap: url.sitemap,
    host: url.site,
  }
}
