import {
  CustomLink,
  ImageGrid,
  RoundedImage,
  TableComponent,
} from '@/components/mdx'
import { YouTubeComponent } from '@/components/youtube'
import type { MDXComponents } from 'mdx/types'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    Image: RoundedImage,
    ImageGrid,
    YouTube: YouTubeComponent,
    a: CustomLink,
    Table: TableComponent,
    ...components,
  }
}
