import { styleText } from 'node:util';

import { BuildError } from './errors';

type FormatStyle = Parameters<typeof styleText>[0];

function printRow(prefix: string, label: string, message: string): void {
  console.info(`${prefix}  ${label.padEnd(20, ' ')} ${styleText('gray', message)}`);
}

// ─────────────────────────────────────

export function section(label: string): void {
  console.info(styleText(['bold', 'blue'], `\n  ${label.toUpperCase()}\n`));
}

export function ok(label: string, message = ''): void {
  printRow(styleText('green', '  ✔'), label, message);
}

export function warn(label: string, message = ''): void {
  printRow(styleText('yellow', '  !'), label, message);
}

export function skip(label: string, message = ''): void {
  printRow(styleText('gray', '  –'), label, message);
}

export function detail(text: string): void {
  console.info(styleText('gray', `     ${text}`));
}

export function success(text: string): void {
  console.info(styleText('green', `\n${text}`));
}

export function divider(format: FormatStyle = 'gray'): void {
  console.info(styleText(format, `\n${'—'.repeat(60)}\n`));
}

export function failure(error: unknown): void {
  divider('red');
  console.error(styleText(['bold', 'red'], '❌ BUILD FAILED\n'));

  const errors = error instanceof AggregateError ? error.errors : [error];

  for (const item of errors) {
    console.error(item instanceof BuildError ? item.message : item, '\n');
  }

  divider('red');
  console.error(styleText('yellow', '🟡 Fix the errors above and try again.\n'));
}
