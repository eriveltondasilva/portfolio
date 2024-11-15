import { ReadingTime } from '@/types'

export function getReadingTime(readingTime: ReadingTime) {
  return readingTime.text.split(' ')[0]
}
