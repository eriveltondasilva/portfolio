import projectsIndex from '@/generated/indexes/projects.json';

import type { Project } from '@/types';

const allProjects = projectsIndex as Project[];
const featuredProjects = allProjects.filter((project) => project.featured);
const otherProjects = allProjects.filter((project) => !project.featured);

export function getFeaturedProjects(): readonly Project[] {
  return featuredProjects;
}

export function getOtherProjects(): readonly Project[] {
  return otherProjects;
}
