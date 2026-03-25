import projectsIndex from '@/indexes/projects.json'

import type { Project } from '@/types'

export function getAllProjects(): Project[] {
  return projectsIndex as Project[]
}

export function getFeaturedProjects(): Project[] {
  return getAllProjects().filter((p) => p.featured)
}
