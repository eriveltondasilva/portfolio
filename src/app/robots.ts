import { URL_BASE } from '#/lib/constants'

import type { MetadataRoute } from 'next'

// app/robots.ts
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${URL_BASE}/sitemap.xml`,
  }
}
