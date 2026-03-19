import { styleText } from 'node:util'

export const logSuccess = (text: string) =>
  console.info(styleText('green', text))
