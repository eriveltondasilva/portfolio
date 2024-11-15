import { type MDXComponents } from 'mdx/types'

import {
  CustomLink,
  ImageGrid,
  RoundedImage,
  TableComponent,
} from '@/components/mdx'
import { YouTubeComponent } from '@/components/youtube'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    a: CustomLink,
    Image: RoundedImage,
    ImageGrid,
    YouTube: YouTubeComponent,
    Table: TableComponent,
    ...components,
  }
}
