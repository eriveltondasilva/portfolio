import { getAllProjects } from '@/lib/blog/projects'
import { BASE_URL } from '@/lib/constants'

import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const projects = getAllProjects()
  const lastModified = new Date()

  return projects.map((project) => ({
    url: `${BASE_URL}/projects/${project.slug}`,
    changeFrequency: 'yearly',
    lastModified,
  }))
}
