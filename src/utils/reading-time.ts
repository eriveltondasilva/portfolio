import { Post } from '@/types'

export function getReadingTime(post: Post) {
  return post?.readingTime.text.split(' ').slice(0, 2).join(' ')
}
