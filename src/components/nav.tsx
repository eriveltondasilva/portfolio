import clsx from 'clsx'
import Link from 'next/link'

import { ThemeToggle } from './theme-toggle'

const items = [
  {
    name: 'Blog',
    href: '/blog',
  },
  {
    name: 'Projects',
    href: '/projects',
  },
  {
    name: 'Mdx Page',
    href: '/mdx-page',
  },
]

export function Nav() {
  return (
    <nav className='mb-12 py-2 lg:mb-16'>
      <div
        className={clsx(
          'flex flex-col md:flex-row',
          'justify-between md:items-center',
        )}
      >
        <div className='flex items-center'>
          <Link href='/' className='text-3xl font-semibold tracking-tight'>
            Erivelton&apos;s
          </Link>
        </div>
        <div
          className={clsx(
            'flex flex-row items-center',
            'mt-6 gap-4 md:ml-auto md:mt-0',
          )}
        >
          {items.map(({ name, href }) => (
            <Link
              key={name}
              href={href}
              className={clsx(
                'relative flex align-middle transition-all',
                'hover:text-neutral-800 dark:hover:text-neutral-200',
              )}
            >
              {name}
            </Link>
          ))}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  )
}
