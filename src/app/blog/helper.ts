import { type Post } from '@/types'

export function filterPostsByTag(posts: Post[], tag?: string) {
  return tag ? posts.filter((post) => post.tags.includes(tag)) : posts
}

export function extractTags(posts: Post[]) {
  return [...new Set(posts.flatMap((post) => post.tags || []))]
}
