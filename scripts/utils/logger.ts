import { styleText } from 'node:util';

type FormatStyle = Parameters<typeof styleText>[0];

class Logger {
  section(label: string) {
    console.info(styleText(['bold', 'blue'], `\n  ${label.toUpperCase()}\n`));
  }

  ok(label: string, detail = '') {
    this.#row(styleText('green', '  ✔'), label, detail);
  }

  skip(label: string, detail = '') {
    this.#row(styleText('yellow', '  –'), label, detail);
  }

  detail(text: string) {
    console.info(styleText('gray', `     ${text}`));
  }

  success(text: string) {
    console.info(styleText('green', `\n${text}`));
  }

  divider(format: FormatStyle = 'gray') {
    console.info(styleText(format, `\n${'—'.repeat(60)}\n`));
  }

  failure(error: unknown) {
    this.divider('red');
    console.error(styleText(['bold', 'red'], '❌ BUILD FAILED\n'));

    const errors = error instanceof AggregateError ? error.errors : [error];

    for (const item of errors) {
      // BuildError is already formatted; anything else needs its stack and cause.
      console.error(item instanceof BuildError ? item.message : item, '\n');
    }

    this.divider('red');
    console.error(
      styleText('yellow', '🟡 Fix the errors above and try again.\n'),
    );
  }

  #row(prefix: string, label: string, detail: string) {
    console.info(
      `${prefix}  ${label.padEnd(20, ' ')} ${styleText('gray', detail)}`,
    );
  }
}

export const log = new Logger();
