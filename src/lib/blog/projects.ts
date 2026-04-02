import projectsIndex from '@/content/indexes/projects.json'

import type { Project } from '@/types'

export function getAllProjects(): Project[] {
  return projectsIndex as Project[]
}

export function getFeaturedProjects(): Project[] {
  return getAllProjects().filter((project) => project.featured)
}
