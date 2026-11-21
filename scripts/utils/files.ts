import { YAML, write as bunWrite, file as bunFile } from 'bun';

import { getErrorMessage } from './errors';

export async function readYaml(filePath: string): Promise<unknown> {
  try {
    return YAML.parse(await bunFile(filePath).text());
  } catch (cause) {
    throw new Error(`Failed to read file: ${filePath}\n  ${getErrorMessage(cause)}`, { cause });
  }
}

export async function writeJson(filePath: string, data: unknown): Promise<void> {
  try {
    await bunWrite(filePath, JSON.stringify(data));
  } catch (cause) {
    throw new Error(`Failed to write file: ${filePath}\n  ${getErrorMessage(cause)}`, { cause });
  }
}
