import { Post } from '@/types'

export function filterPostsByTag(posts: (Post | null)[], tag?: string) {
  return tag ? posts.filter((post) => post?.tags?.includes(tag)) : posts
}

export function extractTags(posts: (Post | null)[]) {
  return [...new Set(posts.flatMap((post) => post?.tags || []))]
}
