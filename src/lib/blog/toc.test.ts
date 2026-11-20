import { describe, expect, it } from 'vitest';

import { flattenToc } from './toc';

import type { Toc } from '@stefanprobst/rehype-extract-toc';

describe('flattenToc', () => {
  it('should flatten nested h2 and h3 entries in document order', () => {
    const toc = [
      {
        id: 'intro',
        value: 'Intro',
        depth: 2,
        children: [{ id: 'setup', value: 'Setup', depth: 3 }],
      },
      { id: 'usage', value: 'Usage', depth: 2 },
    ] as Toc;

    expect(flattenToc(toc)).toEqual([
      { id: 'intro', title: 'Intro', depth: 2 },
      { id: 'setup', title: 'Setup', depth: 3 },
      { id: 'usage', title: 'Usage', depth: 2 },
    ]);
  });

  it('should ignore h4 entries and deeper', () => {
    const toc = [
      {
        id: 'intro',
        value: 'Intro',
        depth: 2,
        children: [{ id: 'detail', value: 'Detail', depth: 4 }],
      },
    ] as Toc;

    expect(flattenToc(toc)).toEqual([{ id: 'intro', title: 'Intro', depth: 2 }]);
  });

  it('should ignore h1 but keep its children', () => {
    const toc = [
      {
        id: 'title',
        value: 'Title',
        depth: 1,
        children: [{ id: 'intro', value: 'Intro', depth: 2 }],
      },
    ] as Toc;

    expect(flattenToc(toc)).toEqual([{ id: 'intro', title: 'Intro', depth: 2 }]);
  });

  it('should skip entries without id but keep their children', () => {
    const toc = [
      {
        value: 'No id',
        depth: 2,
        children: [{ id: 'child', value: 'Child', depth: 3 }],
      },
    ] as Toc;

    expect(flattenToc(toc)).toEqual([{ id: 'child', title: 'Child', depth: 3 }]);
  });

  it('should return an empty list for an empty toc', () => {
    expect(flattenToc([])).toEqual([]);
  });
});
