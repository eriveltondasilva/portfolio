import { GithubTopic, ProjectStatus } from '@/lib/constants';

import type { GithubRepo } from '@/types';

const UTILITY_TOPICS = new Set<string>(Object.values(GithubTopic));

/** GitHub repo names allow uppercase, "_" and "."; project slugs are kebab-case. */
export function toProjectSlug(repoName: string): string {
  return repoName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function formatProjectName(repoName: string): string {
  return repoName
    .split(/[-_.]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function getProjectStatus(
  repo: Pick<GithubRepo, 'archived' | 'topics'>,
): ProjectStatus {
  if (repo.archived) return ProjectStatus.ARCHIVED;
  if (repo.topics?.includes(GithubTopic.WIP)) return ProjectStatus.WIP;

  return ProjectStatus.ACTIVE;
}

export function filterProjectTags(topics: readonly string[] = []): string[] {
  return topics.filter((tag) => !UTILITY_TOPICS.has(tag));
}
