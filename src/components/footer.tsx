'use client'
import {
  Github,
  Instagram,
  Linkedin,
  Mail,
  Twitter,
  type LucideIcon,
} from 'lucide-react'

const YEAR = new Date().getFullYear()

type Item = {
  href: string
  icon: LucideIcon
}

const items: Item[] = [
  { href: '/twitter', icon: Twitter },
  { href: '/github', icon: Github },
  { href: '/instagram', icon: Instagram },
  { href: '/linkedin', icon: Linkedin },
  { href: '/email', icon: Mail },
]

function SocialLinks() {
  return (
    <ul className='float-right flex gap-3.5 text-lg transition-opacity duration-300 hover:opacity-90'>
      {items.map(({ href, icon: Icon }) => (
        <li key={href}>
          <a href={href} target='_blank' rel='noopener noreferrer'>
            <Icon />
          </a>
        </li>
      ))}
    </ul>
  )
}

export default function Footer() {
  return (
    <footer className='mt-16 block text-[#1C1C1C] dark:text-[#D4D4D4] lg:mt-24'>
      <time>© {YEAR}</time>&nbsp;
      <a
        className='no-underline'
        href='#'
        target='_blank'
        rel='noopener noreferrer'
      >
        by Erivelton
      </a>
      <style jsx>{`
        @media screen and (max-width: 480px) {
          article {
            padding-top: 2rem;
            padding-bottom: 4rem;
          }
        }
      `}</style>
      <SocialLinks />
    </footer>
  )
}
