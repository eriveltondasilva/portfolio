import createMDX from '@next/mdx'
import type { NextConfig } from 'next'

import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import remarkParseFrontmatter from 'remark-parse-frontmatter'

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
      [remarkGfm, {singleTilde: false}],
      [
        remarkParseFrontmatter,
        {
          properties: {
            title: { type: 'string', required: true },
            description: { type: 'string', required: true },
            tags: {
              type: 'array',
              maxItems: 5,
              items: { type: 'string' },
              required: true,
            },
            published: { type: 'boolean', required: true },
            createdAt: { type: 'string', format: 'date', required: true },
            updatedAt: { type: 'string', format: 'date', required: true },
          },
        },
      ],
    ],
  },
})

export default withMDX(nextConfig)
