import clsx from 'clsx'
import Link from 'next/link'

import { type NavItem } from '@/types'
import { MobileMenu } from './mobile-menu'
import { ThemeToggle } from './theme-toggle'

function ListItem({ item }: { item: NavItem }) {
  return (
    <li>
      <Link
        href={item.href}
        className={clsx(
          'relative flex align-middle transition-all',
          'hover:text-neutral-800 dark:hover:text-neutral-200',
        )}
        aria-label={item.name}
      >
        {item.name}
      </Link>
    </li>
  )
}

function Header() {
  return (
    <header>
      <Link
        href='/'
        className='flex items-center text-3xl font-semibold tracking-tight'
        aria-label='Home'
      >
        Erivelton&apos;s
      </Link>
    </header>
  )
}

export function Nav({ items }: { items: NavItem[] }) {
  return (
    <nav
      className={clsx('flex justify-between', 'py-4 sm:py-8 md:items-center')}
      aria-label='Main Navigation'
    >
      <Header />
      <div className='flex gap-x-2'>
        <ul
          className={clsx(
            'hidden items-center sm:flex',
            'mt-2 gap-4 md:ml-auto md:mt-0',
          )}
        >
          {items.map((item) => (
            <ListItem key={item.name} item={item} />
          ))}
        </ul>
        <ThemeToggle />
        <MobileMenu items={items} />
      </div>
    </nav>
  )
}
