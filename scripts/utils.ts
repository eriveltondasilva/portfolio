import { styleText } from 'node:util'

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
  failure: function (message: string) {
    const divider = styleText('red', `  ${'─'.repeat(60)}`)

    console.error(styleText(['bold', 'red'], '\n❌ Build failed\n'))
    console.error(divider)
    console.error(`\n${message}\n`)
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

// #

export function assertUniqueSlugs(
  entries: { slug: string; source: string }[],
  context: string,
): void {
  const grouped = Object.groupBy(entries, ({ slug }) => slug)

  const duplicates = Object.entries(grouped).filter(
    ([, group]) => (group?.length ?? 0) > 1,
  )

  if (duplicates.length === 0) return

  const detail = duplicates
    .map(([slug, group]) => {
      const files = (group ?? [])
        .map(({ source }) => `\n    - ${source}`)
        .join('')
      return `  "${slug}" found in:${files}`
    })
    .join('\n')

  throw new BuildError(context, [`Duplicate slugs found:\n${detail}`])
}

// #

export function errorMessage(reason: unknown): string {
  return reason instanceof Error ? reason.message : String(reason)
}

export function unwrapFulfilled<T>(result: PromiseSettledResult<T>): T {
  if (result.status !== 'fulfilled') {
    throw new Error('Expected a fulfilled result, got rejected.')
  }

  return result.value
}
