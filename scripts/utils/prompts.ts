import { BuildError } from './errors';

import type { Interface } from 'node:readline/promises';

export type Validate = (value: string) => string | undefined;

export type Flags<Name extends string> = { readonly [Key in Name]?: string | undefined };

interface Field<Name extends string> {
  name: Name;
  question: string;
  validate: Validate;
  defaultValue?: string | undefined;
}

export type Ask<Name extends string> = (field: Field<Name>) => Promise<string>;

/**
 * Asks each field interactively, unless its value was already given as a CLI flag.
 * A flag value that fails validation throws a `BuildError` under `errorContext`.
 */
export function createAsker<Name extends string>(
  rl: Interface,
  flags: Flags<Name>,
  errorContext: string,
): Ask<Name> {
  return async function ask(field) {
    const flagValue = flags[field.name];

    if (flagValue !== undefined) {
      const error = field.validate(flagValue);

      if (error) throw new BuildError(errorContext, [`--${field.name}: ${error}`]);

      return flagValue;
    }

    const suffix = field.defaultValue ? ` [${field.defaultValue}]` : '';

    while (true) {
      const answer = (await rl.question(`${field.question}${suffix}: `)).trim();
      const value = answer || field.defaultValue || '';
      const error = field.validate(value);

      if (!error) return value;

      console.error(`  ✖ ${error}`);
    }
  };
}
