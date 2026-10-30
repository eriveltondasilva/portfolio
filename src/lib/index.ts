import { GithubTopic, LOCALE, ProjectStatus } from '@/lib/constants';

import type { Author, GithubRepo } from '@/types';

const UTILITY_TOPICS = new Set(Object.values(GithubTopic));

/** Returns the URL path without leading/trailing slashes (e.g. "in/username"). */
export function getUrlPathname(url: string): string {
  return new URL(url).pathname.replace(/^\/+|\/+$/g, '');
}

export function getNameInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word.at(0))
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function formatProjectName(repo: GithubRepo): string {
  return repo.name
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

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

export function getGitHubAvatarUrl(author: Author, size = 40): string {
  return `${author.socials.github}.png?size=${size}`;
}

export function formatDate(
  date: string,
  options?: Intl.DateTimeFormatOptions,
): string {
  try {
    return new Intl.DateTimeFormat(LOCALE, {
      dateStyle: 'medium',
      timeZone: 'UTC',
      ...options,
    }).format(new Date(date));
  } catch {
    return 'Data inválida';
  }
}

export function createListFormatter() {
  return new Intl.ListFormat(LOCALE, {
    style: 'long',
    type: 'conjunction',
  });
}

const FENCED_CODE_REGEX = /^(```|~~~)[\s\S]*?^\1/gm;

export function stripFencedCode(content: string): string {
  return content.replace(FENCED_CODE_REGEX, '');
}
