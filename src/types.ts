import type {
  authorSchema,
  postSchema,
  projectSchema,
  seriesSchema,
} from '@/lib/schemas';
import type { Toc } from '@stefanprobst/rehype-extract-toc';
import type { MDXContent, MDXModule } from 'mdx/types';
import type { z } from 'zod';

export type Series = z.infer<typeof seriesSchema>;
export type Post = z.infer<typeof postSchema>;
export type Author = z.infer<typeof authorSchema>;
export type Project = z.infer<typeof projectSchema>;

export type GridColumns = 2 | 3;

export interface SeriesPostRef {
  slug: string;
  title: string;
  order: number;
}

export interface SeriesIndex extends Series {
  posts: SeriesPostRef[];
}

export interface PostIndex extends Post {
  readingTime: number;
  folder: string;
  coverFile: string | null;
}

export interface PostWithContent {
  Content: MDXContent;
  meta: PostIndex;
  toc: Toc;
}

export interface AdjacentPosts {
  prevPost: PostIndex | null;
  nextPost: PostIndex | null;
}

export interface PostModule extends MDXModule {
  toc: Toc;
}

export interface TocItem {
  id: string;
  title: string;
  depth: number;
}

export interface TagCount {
  tag: string;
  count: number;
}
