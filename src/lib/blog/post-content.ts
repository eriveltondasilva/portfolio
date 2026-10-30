import type { MDXModule } from 'mdx/types';
import { getPostBySlug } from './posts';

import type { PostWithContent } from '@/types';

// Kept apart from posts.ts: the dynamic MDX import below makes the bundler include every post,
// which lightweight consumers (e.g. the reactions API route) must not pay for.
export async function getPostWithContent(
  slug: string,
): Promise<PostWithContent | null> {
  const post = getPostBySlug(slug);

  if (!post) return null;

  const postModule = (await import(
    `@/content/posts/${post.folder}/index.mdx`
  )) as MDXModule;

  return { Content: postModule.default, meta: post };
}
