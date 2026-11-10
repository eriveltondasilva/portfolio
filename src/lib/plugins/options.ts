import type { RehypeExportTocMdxOptions } from '@stefanprobst/rehype-extract-toc/mdx';
import type { Options as RehypeAutolinkHeadingsOptions } from 'rehype-autolink-headings';
import type { Options as RemarkGfmOptions } from 'remark-gfm';

export const remarkGFMOptions: RemarkGfmOptions = {
  // ! A lone "~" (e.g. "~10 min") must not become strikethrough.
  singleTilde: false,
};

export const rehypeAutolinkHeadingsOptions: RehypeAutolinkHeadingsOptions = {
  behavior: 'prepend',
  test: ['h2', 'h3', 'h4'],
  properties: { className: ['anchor'], ariaHidden: 'true', tabIndex: -1 },
  content: {
    type: 'text',
    value: '#',
  },
};

export const rehypeExportTocMdxOptions: RehypeExportTocMdxOptions = {
  name: 'toc',
};
