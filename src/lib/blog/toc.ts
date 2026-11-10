import type { TocItem } from '@/types';
import type { Toc } from '@stefanprobst/rehype-extract-toc';

// # The post title is the page <h1>, so the index starts at h2
const MIN_DEPTH = 2;
const MAX_DEPTH = 3;

export function flattenToc(toc: Toc, items: TocItem[] = []): TocItem[] {
  for (const entry of toc) {
    const isInRange = entry.depth >= MIN_DEPTH && entry.depth <= MAX_DEPTH;

    if (entry.id && isInRange) {
      items.push({ id: entry.id, title: entry.value, depth: entry.depth });
    }

    if (entry.children) flattenToc(entry.children, items);
  }

  return items;
}
