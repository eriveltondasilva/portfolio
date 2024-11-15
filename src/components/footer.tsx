'use client'
import { social } from '@/config'
import { Github, Linkedin, Mail, Twitter } from 'lucide-react'

const YEAR = new Date().getFullYear()

const items = [
  { title: 'X|Twitter', href: social.twitter, icon: Twitter },
  { title: 'Github', href: social.github, icon: Github },
  { title: 'Linkedin', href: social.linkedin, icon: Linkedin },
  { title: 'Email', href: social.mail, icon: Mail },
]

function SocialLinks() {
  return (
    <>
      {items?.map(({ title, href, icon: Icon }) => (
        <li key={title} className='hover:opacity-50'>
          <a
            href={href}
            title={title}
            target='_blank'
            rel='noopener noreferrer'
          >
            <Icon />
          </a>
        </li>
      ))}
    </>
  )
}

export function Footer() {
  return (
    <footer className='flex flex-col items-center justify-between gap-2 py-8 sm:flex-row'>
      <section>
        <time>© {YEAR}</time>&nbsp;
        <a
          className='no-underline'
          href='#'
          target='_blank'
          rel='noopener noreferrer'
        >
          by Erivelton
        </a>
      </section>
      <section>
        <ul className='duration-600 flex gap-3.5 text-lg transition-opacity'>
          <SocialLinks />
        </ul>
      </section>
    </footer>
  )
}
