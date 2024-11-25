import { type Skill } from './types'

const ENV = {
  GITHUB_URL: process.env.NEXT_PUBLIC_GITHUB_URL || '#',
  LINKEDIN_URL: process.env.NEXT_PUBLIC_LINKEDIN_URL || '#',
  TWITTER_URL: process.env.NEXT_PUBLIC_TWITTER_URL || '#',
  MAIL_URL: process.env.NEXT_PUBLIC_MAIL_URL || '#',
  //
  GITHUB_AVATAR_URL: process.env.GITHUB_AVATAR || '',
  GITHUB_REPOS_URL: process.env.GITHUB_REPOS || '',
  VERCEL_URL:
    process.env.VERCEL_URL ?
      `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000',
} as const

export const meta = {
  title: "Erivelton's portfolio",
  description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit.',
  keywords: 'Next.js, React, JavaScript',
  author: 'Erivelton Silva',
  locale: 'pt-BR',
  baseUrl: ENV.VERCEL_URL,
  github: ENV.GITHUB_URL,
} as const

export const social = {
  twitter: ENV.TWITTER_URL,
  github: ENV.GITHUB_URL,
  linkedin: ENV.LINKEDIN_URL,
  mail: ENV.MAIL_URL,
} as const

export const routes = {
  home: '/',
  blog: '/blog',
  projects: '/projects',
  about: '/about',
  helloWorld: '/hello-world',
} as const

export const navItems = [
  {
    name: 'Blog',
    href: routes.blog,
  },
  {
    name: 'Projects',
    href: routes.projects,
  },
  {
    name: 'About',
    href: routes.about,
  },
]

export const skills: Skill[] = [
  { label: 'JavaScript', href: '#' },
  { label: 'TypeScript', href: '#' },
  { label: 'Nodejs', href: '#' },
  { label: 'Express', href: '#' },
  { label: 'Reactjs', href: '#' },
  { label: 'Nextjs', href: '#' },
  { label: 'TailwindCSS', href: '#' },
]

export const url = {
  site: ENV.VERCEL_URL,
  sitemap: `${ENV.VERCEL_URL}/sitemap.xml`,
  githubAvatar: ENV.GITHUB_AVATAR_URL,
  githubRepos: ENV.GITHUB_REPOS_URL,
} as const
