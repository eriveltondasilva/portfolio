import GithubSlugger from 'github-slugger';

import type { Heading } from '@/types';

const FENCED_CODE_REGEX = /^(```|~~~)[\s\S]*?^\1/gm;
const HEADING_REGEX = /^(#{1,6})\s+(.+)$/gm;

// Approximates the text content rehype-slug sees, so ids stay in sync with the rendered page.
function toPlainText(markdown: string): string {
  return markdown
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[`*]/g, '')
    .replace(/\s+#+\s*$/, '')
    .trim();
}

export function stripFencedCode(content: string): string {
  return content.replace(FENCED_CODE_REGEX, '');
}

export function extractHeadings(rawContent: string): Heading[] {
  const slugger = new GithubSlugger();
  // `#` lines inside code fences (shell/YAML comments) are not headings.
  const content = stripFencedCode(rawContent);

  return Array.from(
    content.matchAll(HEADING_REGEX),
    ([, hashes = '', rawText = '']) => {
      const text = toPlainText(rawText);

      return { id: slugger.slug(text), text, level: hashes.length };
    },
  );
}
