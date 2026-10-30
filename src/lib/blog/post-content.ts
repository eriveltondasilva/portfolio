import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { POST_CONTENT_FILE } from '@/lib/constants';
import { extractHeadings } from '@/lib/headings';
import { POSTS_DIR } from '@/lib/paths';

import { getPostBySlug } from './posts';

import type { PostWithContent } from '@/types';

// Kept apart from posts.ts: the dynamic MDX import below makes the bundler include every post,
// which lightweight consumers (e.g. the reactions API route) must not pay for.
export async function getPostWithContent(
  slug: string,
): Promise<PostWithContent | undefined> {
  const post = getPostBySlug(slug);

  if (!post) return;

  const [{ default: Content }, raw] = await Promise.all([
    import(`@/content/posts/${post.folder}/index.mdx`),
    readFile(join(POSTS_DIR, post.folder, POST_CONTENT_FILE), 'utf-8'),
  ]);

  return { Content, meta: post, headings: extractHeadings(raw) };
}
