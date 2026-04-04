import { styleText } from 'node:util'

type FormatStyle = Parameters<typeof styleText>[0]

export function sortByDateDesc<T extends { publishedAt: string }>(items: T[]): T[] {
  return items.toSorted(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  )
}

// # Logger

export class Logger {
  section(label: string) {
    console.info(styleText(['bold', 'blue'], `\n  ${label.toUpperCase()}\n`))
  }

  ok(label: string, detail = '') {
    console.info(
      [styleText('green', '  ✔'), '  ', label, detail ? '\t' + styleText('gray', detail) : ''].join(
        '',
      ),
    )
  }

  skip(label: string, detail = '') {
    console.info(
      [
        styleText('yellow', '  –'),
        '  ',
        label,
        detail ? '\t' + styleText('gray', detail) : '',
      ].join(''),
    )
  }

  detail(text: string) {
    console.info(styleText('gray', `     ${text}`))
  }

  success(text: string) {
    console.info(styleText('green', `\n${text}`))
  }

  divider(format: FormatStyle = 'gray') {
    console.info(styleText(format, `\n${'—'.repeat(60)}\n`))
  }

  failure(err: unknown) {
    this.divider('red')
    console.error(styleText(['bold', 'red'], '❌ BUILD FAILED\n'))
    console.error(getErrMessage(err))
    this.divider('red')

    console.error(styleText('yellow', '🟡 Fix the errors above and try again.\n'))
  }
}

// # Errors

export class BuildError extends Error {
  constructor(
    readonly context: string,
    messages: string[],
  ) {
    super(`[${context}] ${messages.length} error(s) found:\n\n${messages.join('\n')}`)
    this.name = 'BuildError'
  }
}

export function getErrMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}

// # Files

export async function readJson(filePath: string): Promise<unknown> {
  try {
    return await Bun.file(filePath).json()
  } catch (cause) {
    throw new Error(`Failed to read file: ${filePath}`, { cause })
  }
}

export async function writeJson(filePath: string, data: unknown): Promise<void> {
  try {
    await Bun.write(filePath, JSON.stringify(data, null, 2))
  } catch (cause) {
    throw new Error(`Failed to write file: ${filePath}`, { cause })
  }
}
