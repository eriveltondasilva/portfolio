'use client'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { clsx } from 'clsx'
import { Menu as MenuIcon } from 'lucide-react'
import Link from 'next/link'

import { useTheme } from '@/hooks/useTheme'

import { type NavItem } from '@/types'

export function MobileMenu({ items }: { items: NavItem[] }) {
  const { isDark } = useTheme()

  if (!items?.length) return null

  return (
    <div className='sm:hidden'>
      <Menu>
        <MenuButton
          className={clsx(
            'inline-flex items-center gap-2',
            'rounded-md p-2 text-sm font-semibold',
            'focus:outline-none',
            'data-[hover]:bg-gray-700 data-[open]:bg-gray-700',
            'data-[focus]:outline-1 data-[focus]:outline-white',
            isDark ? 'bg-gray-800 text-white' : 'bg-blue-100 text-gray-800',
          )}
        >
          <MenuIcon />
        </MenuButton>

        <MenuItems
          transition
          anchor='bottom end'
          className={clsx(
            'origin-top-right rounded-xl text-sm/6 [--anchor-gap:var(--spacing-1)] focus:outline-none',
            'bg-gray-800 text-white',
            'mt-1 w-52 p-1',
            'transition duration-100 ease-out',
            'data-[closed]:scale-95 data-[closed]:opacity-0',
          )}
        >
          {items?.map(({ name, href }) => (
            <MenuItem key={name}>
              <Link
                href={href}
                className={clsx(
                  'flex w-full items-center gap-2',
                  'group rounded-lg data-[focus]:bg-white/10',
                  'px-3 py-1.5',
                )}
              >
                {name}
              </Link>
            </MenuItem>
          ))}
        </MenuItems>
      </Menu>
    </div>
  )
}
