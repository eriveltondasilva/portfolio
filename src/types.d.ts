import { MDXComponents } from '@types/mdx'
export type Theme = 'light' | 'dark'

export type Project = {
  id: number
  name: string
  description: string
  html_url: string
  created_at: string
  topics: string[]
}

export type Frontmatter = {
  title: string
  description: string
  tags: string[]
  published: boolean
  createdAt: Date
  updatedAt: string
}

export type Post = {
  default: MDXComponents
  frontmatter: Frontmatter
  slug: string
}
