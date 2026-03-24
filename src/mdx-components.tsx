import { Link } from './components/mdx/link'
import { Youtube } from './components/mdx/youtube'
import { Image } from './components/mdx/image'
import { RatioImage } from './components/mdx/ratio-image'
import { ImageGrid } from './components/mdx/image-grid'
import { Table } from './components/mdx/table'

import type { MDXComponents } from 'mdx/types'

const components = {
  a: Link,
  img: Image,
  Image,
  RatioImage,
  ImageGrid,
  Table,
  Youtube,
} satisfies MDXComponents

export function useMDXComponents(): MDXComponents {
  return components
}
