'use client'
import clsx from 'clsx'
import { Moon, Sun } from 'lucide-react'

import { useTheme } from '@/hooks/useTheme'

export function ThemeToggle() {
  const { handleTheme, isMounted, isDark } = useTheme()

  if (!isMounted) return null

  return (
    <button
      onClick={handleTheme}
      className={clsx(
        'rounded-lg p-2 transition-colors duration-200',
        'hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-blue-400',
        isDark ? 'bg-gray-800 text-yellow-300' : 'bg-blue-100 text-gray-800',
      )}
    >
      {isDark && <Sun className='size-5 animate-[spin_8s_linear_infinite]' />}

      {!isDark && (
        <Moon className='duration-400 size-5 transition-transform hover:-rotate-12' />
      )}
    </button>
  )
}
