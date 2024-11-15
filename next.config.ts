import createMDX from '@next/mdx'
import type { NextConfig } from 'next'

import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import remarkParseFrontmatter from 'remark-parse-frontmatter'
import remarkReadingTime from 'remark-reading-time'
import readingMdxTime from 'remark-reading-time/mdx'
import remarkToc from 'remark-toc'

import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeHighlight from 'rehype-highlight'
import rehypeHighlightCodeLines from 'rehype-highlight-code-lines'
import rehypeSlug from 'rehype-slug'

import {
  gfmOptions,
  highlightCodeLinesOptions,
  parseFrontmatterOptions,
  tocOptions,
} from '@/plugins'

const nextConfig: NextConfig = {
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
    ],
  },
}

const withMDX = createMDX({
  options: {
    remarkPlugins: [
      remarkFrontmatter,
      remarkMdxFrontmatter,
      remarkReadingTime,
      readingMdxTime,
      [remarkToc, tocOptions],
      [remarkGfm, gfmOptions],
      [remarkParseFrontmatter, parseFrontmatterOptions],
    ],
    rehypePlugins: [
      rehypeSlug,
      rehypeAutolinkHeadings,
      rehypeHighlight,
      [rehypeHighlightCodeLines, highlightCodeLinesOptions],
    ],
  },
})

export default withMDX(nextConfig)
