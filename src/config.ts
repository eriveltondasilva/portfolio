export const avatar = process.env.GITHUB_AVATAR || ''
export const githubRepos = process.env.GITHUB_REPOS || ''

export const meta = {
  title: "Erivelton's portfolio",
  description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit.',
  baseUrl: 'https://eriveltondasilva.vercel.app',
  keywords: 'Next.js, React, JavaScript',
  author: 'Erivelton da Silva',
  github: 'https://github.com/eriveltondasilva',
  locale: 'pt-BR',
}

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
  {
    name: 'About',
    href: '/about',
  },
]
