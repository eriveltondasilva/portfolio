import type { Metadata } from 'next'

export const avatar = process.env.GITHUB_AVATAR || ''
export const githubRepos = process.env.GITHUB_REPOS || ''

export const meta: Metadata = {
  title: "Erivelton's portfolio",
  description: 'lorem ipsum dolor sit amet consectetur adipiscing elit.',
} as const

export const social = {
  twitter: '#',
  instagram: '#',
  github: 'https://github.com/eriveltondasilva',
  linkedin: '#',
  mail: '#',
} as const

export const navItems = [
  {
    name: 'Blog',
    href: '/blog',
  },
  {
    name: 'Projects',
    href: '/projects',
  },
]
