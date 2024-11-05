import type { Metadata } from 'next'

export const meta: Metadata = {
  title: "Erivelton's portfolio",
  description: 'lorem ipsum dolor sit amet consectetur adipiscing elit.',
} as const

export const social = {
  twitter: '#',
  github: '#',
  linkedin: '#',
  mail: '#',
}

export const avatar = process.env.GITHUB_AVATAR || ''

export const githubRepos = process.env.GITHUB_REPOS || ''
