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

export type Post = {
  title: string
  description: string
  tags: string[]
  published: boolean
  createdAt: string
  updatedAt: string
  slug: string
  content: MDXComponents
}

export type NavItem = {
  name: string
  href: string
}
