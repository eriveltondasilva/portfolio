import createMDX from '@next/mdx'

import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  typedRoutes: true,
  pageExtensions: ['ts', 'tsx', 'mdx'],
}

const withMDX = createMDX({
  extension: /\.mdx$/,
  options: {
    remarkPlugins: [
      'remark-frontmatter',
      ['remark-mdx-frontmatter', { name: 'meta' }],
    ],
  },
})

export default withMDX(nextConfig)
