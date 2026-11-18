import 'server-only';

import projectsIndex from '@/generated/indexes/projects.json';

import type { Project } from '@/types';

const featuredProjects: Project[] = [];
const otherProjects: Project[] = [];

for (const project of projectsIndex as Project[]) {
  if (project.featured) {
    featuredProjects.push(project);
  } else {
    otherProjects.push(project);
  }
}

// ─────────────────────────────────────

export const projectCount = projectsIndex.length;

export function getFeaturedProjects(): ReadonlyArray<Project> {
  return featuredProjects;
}

export function getOtherProjects(): ReadonlyArray<Project> {
  return otherProjects;
}
