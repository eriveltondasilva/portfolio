import GithubSlugger from 'github-slugger'

import { ProjectStatus, Topics, LOCALES } from '@/lib/constants'

import type { Author, GithubRepo, Heading } from '@/types'

const UTILITY_TOPICS = new Set(Object.values(Topics))

export function extractHeadings(rawContent: string): Heading[] {
  const slugger = new GithubSlugger()
  const headingRegex = /^(#{1,6})\s+(.+)$/gm
  const headings: Heading[] = []

  for (const [, hashes, rawText] of rawContent.matchAll(headingRegex)) {
    const text = rawText!.trim()
    headings.push({
      id: slugger.slug(text),
      text,
      level: hashes!.length,
    })
  }

  return headings
}

export function getUrlPathname(url: string): string | null {
  return new URL(url).pathname?.replace('/', '') ?? null
}

export function getNameInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word.at(0))
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function formatProjectName(repo: GithubRepo): string {
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

export function filterProjectTags(repo: GithubRepo): string[] {
  return (repo.topics ?? []).filter((tag) => !UTILITY_TOPICS.has(tag as Topics))
}

export function getGitHubAvatarUrl(author: Author, size = 40): string {
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

export function createListFormatter() {
  return new Intl.ListFormat(LOCALES, {
    style: 'long',
    type: 'conjunction',
  })
}
