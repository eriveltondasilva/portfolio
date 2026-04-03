import { styleText } from 'node:util'

export function sortByDateDesc<T extends { publishedAt: string }>(
  items: T[],
): T[] {
  return items.toSorted(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  )
}

// # Logger

export const log = {
  section: function (label: string) {
    console.info(styleText(['bold', 'cyan'], `\n  ${label}`))
  },
  //
  ok: function (label: string, detail = '') {
    console.info(
      styleText('green', '  ✔') +
        '  ' +
        label +
        (detail ? '  ' + styleText('dim', detail) : ''),
    )
  },
  //
  skip: function (label: string, detail = '') {
    console.info(
      styleText('yellow', '  –') +
        '  ' +
        label +
        (detail ? '  ' + styleText('dim', detail) : ''),
    )
  },
  //
  detail: function (text: string) {
    console.info(styleText('gray', `     ${text}`))
  },
  //
  success: function (text: string) {
    console.info(styleText('green', text))
  },
  //
  failure: function (err: unknown) {
    const divider = styleText('red', `  ${'─'.repeat(60)}`)
    const error = getErrMessage(err)

    console.error(styleText(['bold', 'red'], '\n❌ Build failed\n'))
    console.error(divider)
    console.error(`\n${error}\n`)
    console.error(divider)
    console.error(
      styleText('yellow', '\n  Fix the errors above and try again.\n'),
    )
  },
}

// # Errors

export class BuildError extends Error {
  constructor(
    readonly context: string,
    messages: string[],
  ) {
    super(
      `[${context}] ${messages.length} error(s) found:\n\n${messages.join('\n')}`,
    )
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

export async function writeJson(
  filePath: string,
  data: unknown,
): Promise<void> {
  try {
    await Bun.write(filePath, JSON.stringify(data, null, 2))
  } catch (cause) {
    throw new Error(`Failed to write file: ${filePath}`, { cause })
  }
}
