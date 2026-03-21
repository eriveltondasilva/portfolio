import { styleText } from 'node:util'

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

export function getGitHubUsername(url: string): string | null {
  try {
    return new URL(url).pathname.replace('/', '')
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
