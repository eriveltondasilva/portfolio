import { MDXComponents } from '@types/mdx'

export type ReadingTime = {
  text: string
  minutes: number
  time: number
  words: number
}

export type Skill = {
  label: string
  href: string
}

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
  createdAt: string
  updatedAt?: string
  isPublished: boolean
  tags: string[]
  author?: string
  slug: string[]
  readingTime: ReadingTime
  content: MDXComponents
}

export type NavItem = {
  name: string
  href: string
}
