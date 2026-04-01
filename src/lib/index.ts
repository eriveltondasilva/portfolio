import type { Author } from '#/types'

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
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function getGithubAvatar(author: Author, size = 40): string {
  return `${author.socials.github}.png?size=${size}`
}

export function formatDate(
  date: string,
  options?: Intl.DateTimeFormatOptions,
): string {
  try {
    return new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'medium',
      timeZone: 'UTC',
      ...options,
    }).format(new Date(date))
  } catch {
    return 'Data inválida'
  }
}

export function formatList() {
  return new Intl.ListFormat('pt-BR', {
    style: 'long',
    type: 'conjunction',
  })
}
