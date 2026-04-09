import createMDX from '@next/mdx'
// import { transformerNotationDiff, transformerNotationFocus } from '@shikijs/transformers'

import type { NextConfig } from 'next'
import type { Options as PrettyCodeOptions } from 'rehype-pretty-code'
import type { Options as AutolinkHeadingsOptions } from 'rehype-autolink-headings'
import type { Options as RemarkGfmOptions } from 'remark-gfm'

// ###

const remarkGFMOptions: RemarkGfmOptions = {
  singleTilde: false,
}

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
  bypassInlineCode: true,
}

// ###

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  reactCompiler: true,
  typedRoutes: true,
  pageExtensions: ['ts', 'tsx', 'mdx'],
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    qualities: [50, 75, 90],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 dias
  },
}

const withMDX = createMDX({
  options: {
    remarkPlugins: ['remark-frontmatter', ['remark-gfm', remarkGFMOptions], 'remark-gemoji'],
    rehypePlugins: [
      'rehype-slug',
      ['rehype-autolink-headings', autolinkHeadingsOptions],

      'rehype-unwrap-images',
      'rehype-mdx-import-media',
      ['rehype-pretty-code', prettyCodeOptions],
    ],
  },
})

// ###

export default withMDX(nextConfig)
