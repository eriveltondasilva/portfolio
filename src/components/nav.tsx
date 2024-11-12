import clsx from 'clsx'
import Link from 'next/link'

import { ThemeToggle } from './theme-toggle'
import { NavItem } from '@/types'

function ListItem({ items }: { items: NavItem[] }) {
  return (
    <>
      {items.map(({ name, href }) => (
        <li key={name}>
          <Link
            href={href}
            className={clsx(
              'relative flex align-middle transition-all',
              'hover:text-neutral-800 dark:hover:text-neutral-200',
            )}
          >
            {name}
          </Link>
        </li>
      ))}
    </>
  )
}

export function Nav({ items }: { items: NavItem[] }) {
  return (
    <nav
      className={clsx('flex flex-col justify-between md:flex-row', 'py-4 sm:py-8 md:items-center')}
    >
      <header>
        <Link href='/' className='flex items-center text-3xl font-semibold tracking-tight'>
          Erivelton&apos;s
        </Link>
      </header>
      <ul className={clsx('flex flex-row items-center', 'mt-2 gap-4 md:ml-auto md:mt-0')}>
        <ListItem items={items} />
        <ThemeToggle />
      </ul>
    </nav>
  )
}
