import createMDX from '@next/mdx'

import type { NextConfig } from 'next'
import type { Options as PrettyCodeOptions } from 'rehype-pretty-code'
import type { Options as AutolinkHeadingsOptions } from 'rehype-autolink-headings'

const autolinkHeadingsOptions: AutolinkHeadingsOptions = {
  behavior: 'prepend',
  content: {
    type: 'text',
    value: '#',
  },
}

const prettyCodeOptions: PrettyCodeOptions = {
  theme: 'github-dark-default',
  defaultLang: 'plaintext',
}

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  reactCompiler: true,
  typedRoutes: true,
  pageExtensions: ['ts', 'tsx', 'mdx'],
}

const withMDX = createMDX({
  options: {
    remarkPlugins: ['remark-frontmatter', 'remark-gfm', 'remark-gemoji'],
    rehypePlugins: [
      'rehype-slug',
      ['rehype-autolink-headings', autolinkHeadingsOptions],
      ['rehype-pretty-code', prettyCodeOptions],
    ],
  },
})

export default withMDX(nextConfig)
