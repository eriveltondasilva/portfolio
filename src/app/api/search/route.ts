import { getAllPosts } from '@/lib/blog/posts';

import type { SearchEntry } from '@/types';

export const dynamic = 'force-static';

export function GET() {
  const entries = getAllPosts().map(
    ({ slug, title, description, tags }): SearchEntry => ({
      slug,
      title,
      description,
      tags,
    }),
  );

  return Response.json(entries);
}
