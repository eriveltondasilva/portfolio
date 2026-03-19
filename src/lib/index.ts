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
