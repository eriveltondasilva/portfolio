import { getPostBySlug } from './posts';

import type { PostModule, PostWithContent } from '@/types';

export async function getPostWithContent(
  slug: string,
): Promise<PostWithContent | null> {
  const post = getPostBySlug(slug);

  if (!post) return null;

  const { default: Content, toc } = (await import(
    `@/content/posts/${post.folder}/index.mdx`
  )) as PostModule;

  return { Content, meta: post, toc };
}
