import { useTheme as useNextTheme } from 'next-themes'
import { useCallback, useEffect, useState } from 'react'

export function useTheme() {
  const { resolvedTheme, setTheme } = useNextTheme()
  const [isMounted, setIsMounted] = useState(false)
  const isDark = resolvedTheme === 'dark'

  useEffect(() => setIsMounted(true), [])

  const handleTheme = useCallback(() => {
    setTheme(isDark ? 'light' : 'dark')
  }, [isDark, setTheme])

  return {
    theme: resolvedTheme,
    isDark,
    isMounted,
    handleTheme,
  }
}
