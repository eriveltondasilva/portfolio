import { ProjectStatus, Topics, LOCALES } from '@/lib/constants'

import type { Author, GithubRepo } from '@/types'

const UTILITY_TOPICS = new Set(Object.values(Topics))

export function getGitHubUsername(author: Author): string | null {
  try {
    return new URL(author.socials.github).pathname.replace('/', '')
  } catch {
    return null
  }
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word.at(0))
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function getProjectName(repo: GithubRepo): string {
  return repo.name
    .split('-')
    .map((word) => word.at(0)?.toUpperCase() + word.slice(1))
    .join(' ')
}

export function getProjectStatus(repo: GithubRepo): ProjectStatus {
  if (repo.archived) return ProjectStatus.ARCHIVED
  if (repo.topics?.includes(Topics.WIP)) return ProjectStatus.WIP

  return ProjectStatus.ACTIVE
}

export function getProjectTags(repo: GithubRepo): string[] {
  return (repo.topics ?? []).filter((tag) => !UTILITY_TOPICS.has(tag as Topics))
}

export function getGithubAvatar(author: Author, size = 40): string {
  return `${author.socials.github}.png?size=${size}`
}

export function formatDate(date: string, options?: Intl.DateTimeFormatOptions): string {
  try {
    return new Intl.DateTimeFormat(LOCALES, {
      dateStyle: 'medium',
      timeZone: 'UTC',
      ...options,
    }).format(new Date(date))
  } catch {
    return 'Data inválida'
  }
}

export function formatList() {
  return new Intl.ListFormat(LOCALES, {
    style: 'long',
    type: 'conjunction',
  })
}
