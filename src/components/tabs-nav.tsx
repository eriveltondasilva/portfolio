'use client'

import {
  BookMarkedIcon,
  BookOpenIcon,
  FolderGit2,
  HashIcon,
  LayoutGridIcon,
  type LucideIcon,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

import { Icon } from './icon'

import type { Route } from 'next'

interface Tab {
  label: string
  href: Route
  icon: LucideIcon
}

const tabs: Tab[] = [
  { label: 'Overview', href: '/', icon: LayoutGridIcon },
  { label: 'Blog', href: '/blog', icon: BookOpenIcon },
  { label: 'Séries', href: '/series', icon: BookMarkedIcon },
  { label: 'Projetos', href: '/projects', icon: FolderGit2 },
  { label: 'Tags', href: '/tags', icon: HashIcon },
]

export function TabsNav() {
  const pathname = usePathname()

  return (
    <nav
      className='border-b border-zinc-200 dark:border-zinc-700/60'
      aria-label='Navegação principal'
    >
      <div className='-mb-px flex overflow-x-auto'>
        {tabs.map(({ label, href, icon }) => {
          const isActive =
            href === '/' ? pathname === '/' : pathname.startsWith(href)

          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                'flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors',
                isActive ?
                  'border-orange-500 text-zinc-900 dark:border-orange-400 dark:text-zinc-50'
                : 'border-transparent text-zinc-600 hover:border-zinc-300 hover:text-zinc-900 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:text-zinc-200',
              )}
            >
              <Icon iconNode={icon} />
              {label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
