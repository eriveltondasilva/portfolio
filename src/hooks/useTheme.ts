import { Theme } from '@/types'
import { useEffect, useState } from 'react'

const isBrowser = typeof window !== 'undefined'

export function getInitialTheme(): Theme {
  if (!isBrowser) return 'light'

  const savedTheme = localStorage?.getItem('theme') || 'light'

  if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme

  if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark'

  return 'light'
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  const toggleTheme = () => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'))
  }

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.classList.add(theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handleChange = (e: MediaQueryListEvent) =>
      setTheme(e.matches ? 'dark' : 'light')

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const isDark = theme === 'dark'

  return { theme, isDark, toggleTheme }
}
