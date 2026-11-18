import type { TocItem } from '@/types';
import type { Toc } from '@stefanprobst/rehype-extract-toc';

// # The post title is the page <h1>, so the index starts at h2
const MIN_DEPTH = 2;
const MAX_DEPTH = 3;

export function flattenToc(toc: Toc): TocItem[] {
  return toc.flatMap(({ id, value, depth, children = [] }) => {
    const isInRange = depth >= MIN_DEPTH && depth <= MAX_DEPTH;
    const current = id && isInRange ? [{ id, title: value, depth }] : [];

    return [...current, ...flattenToc(children)];
  });
}
