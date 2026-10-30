import { getErrMessage } from './errors';

export async function readYaml(filePath: string): Promise<unknown> {
  try {
    return Bun.YAML.parse(await Bun.file(filePath).text());
  } catch (cause) {
    throw new Error(
      `Failed to read file: ${filePath}\n  ${getErrMessage(cause)}`,
      { cause },
    );
  }
}

export async function writeJson(
  filePath: string,
  data: unknown,
): Promise<void> {
  try {
    await Bun.write(filePath, JSON.stringify(data));
  } catch (cause) {
    throw new Error(
      `Failed to write file: ${filePath}\n  ${getErrMessage(cause)}`,
      { cause },
    );
  }
}
