import { MDXComponents } from '@types/mdx'

type ReadingTime = {
  text: string
  minutes: number
  time: number
  words: number
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
  tags: string[]
  published: boolean
  createdAt: string
  updatedAt: string
  slug: string
  readingTime: ReadingTime
  content?: MDXComponents
}

export type NavItem = {
  readonly name: string
  readonly href: string
}
