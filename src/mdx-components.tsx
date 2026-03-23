import { Link } from './components/mdx/link'
import { Table } from './components/mdx/table'
import { Youtube } from './components/mdx/youtube'
import { Image, RatioImage } from './components/mdx/image'
import { ImageGrid } from './components/mdx/image-grid'

import type { MDXComponents } from 'mdx/types'

const components = {
  a: Link,
  img: Image,
  RatioImage,
  ImageGrid,
  Table,
  Youtube,
} satisfies MDXComponents

export function useMDXComponents(): MDXComponents {
  return components
}
