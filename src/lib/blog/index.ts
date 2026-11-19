import type { PostIndex } from '@/types';

export function getPostDisplayDate(post: Pick<PostIndex, 'publishedAt' | 'updatedAt'>): string {
  return post.updatedAt ?? post.publishedAt;
}
