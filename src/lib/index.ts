import { styleText } from 'node:util'

import type { Author } from '@/types'

export const logSuccess = (text: string) =>
  console.info(styleText('green', text))

export async function writeJson(
  filePath: string,
  data: unknown,
): Promise<void> {
  try {
    await Bun.write(filePath, JSON.stringify(data, null, 2))
    console.info(`> File saved: ${filePath}`)
  } catch (cause) {
    throw new Error(`Failed to write file: ${filePath}`, { cause })
  }
}

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
