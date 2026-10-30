import projectsIndex from '@/generated/indexes/projects.json';

import type { Project } from '@/types';

const allProjects = projectsIndex as Project[];

export function getAllProjects(): Project[] {
  return [...allProjects];
}

export function getFeaturedProjects(): Project[] {
  return allProjects.filter((project) => project.featured);
}
