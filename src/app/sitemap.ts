import { BASE_URL } from '@/lib/constants';

import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteMap = [
    `${BASE_URL}/`,
    `${BASE_URL}/blog`,
    `${BASE_URL}/projects`,
    `${BASE_URL}/series`,
    `${BASE_URL}/tags`,
  ] as const;
  const lastModified = new Date();

  return siteMap.map((url) => ({
    url,
    lastModified,
    changeFrequency: 'yearly',
  }));
}
