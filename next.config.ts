import { join } from 'node:path';
import { cwd } from 'node:process';

import createMDX from '@next/mdx';

import {
  rehypeAutolinkHeadingsOptions,
  rehypeExportTocMdxOptions,
  remarkGFMOptions,
} from './src/lib/plugins/options';

import type { NextConfig } from 'next';

// ─────────────────────────────────────

const mdxPluginPath = (fileName: string) =>
  join(cwd(), 'src', 'lib', 'plugins', fileName + '.ts');

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [['remark-gfm', remarkGFMOptions], 'remark-gemoji'],
    rehypePlugins: [
      'rehype-slug',
      '@stefanprobst/rehype-extract-toc',
      ['@stefanprobst/rehype-extract-toc/mdx', rehypeExportTocMdxOptions],
      ['rehype-autolink-headings', rehypeAutolinkHeadingsOptions],
      'rehype-unwrap-images',
      'rehype-mdx-import-media',
      mdxPluginPath('rehype-pretty-code'),
    ],
  },
});

// ─────────────────────────────────────

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  reactCompiler: true,
  typedRoutes: true,
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    qualities: [50, 75, 90],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 dias
  },
};

export default withMDX(nextConfig);
