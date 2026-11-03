import { GithubTopic, ProjectStatus } from '@/lib/constants';

import type { GithubRepo } from '@/types';

const UTILITY_TOPICS = new Set(Object.values(GithubTopic));

export function getProjectStatus(repo: GithubRepo): ProjectStatus {
  if (repo.archived) return ProjectStatus.ARCHIVED;
  if (repo.topics?.includes(GithubTopic.WIP)) return ProjectStatus.WIP;

  return ProjectStatus.ACTIVE;
}

export function filterProjectTags(repo: GithubRepo): string[] {
  return (repo.topics ?? []).filter(
    (tag) => !UTILITY_TOPICS.has(tag as GithubTopic),
  );
}

const FENCED_CODE_REGEX = /^(```|~~~)[\s\S]*?^\1/gm;

export function stripFencedCode(content: string): string {
  return content.replace(FENCED_CODE_REGEX, '');
}
