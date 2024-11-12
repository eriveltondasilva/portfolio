const ENV = {
  GITHUB_BASE_URL: process.env.GITHUB || '',
  GITHUB_AVATAR_URL: process.env.GITHUB_AVATAR || '',
  GITHUB_REPOS_URL: process.env.GITHUB_REPOS || '',
  VERCEL_BASE_URL: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '',
} as const

export const meta = {
  title: "Erivelton's portfolio",
  description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit.',
  keywords: 'Next.js, React, JavaScript',
  author: 'Erivelton da Silva',
  locale: 'pt-BR',
  baseUrl: ENV.VERCEL_BASE_URL,
  github: ENV.GITHUB_BASE_URL,
} as const

export const social = {
  twitter: '#',
  instagram: '#',
  github: ENV.GITHUB_BASE_URL,
  linkedin: '#',
  mail: '#',
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

export const url = {
  site: ENV.VERCEL_BASE_URL,
  sitemap: `${ENV.VERCEL_BASE_URL}/sitemap.xml`,
  githubAvatar: ENV.GITHUB_AVATAR_URL,
  githubRepos: ENV.GITHUB_REPOS_URL,
} as const
