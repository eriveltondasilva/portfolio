'use client'

import { useEffect, useState } from 'react'

export function ReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    function handleScroll() {
      const scrollTop = window.scrollY
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight

      if (docHeight <= 0) return

      setProgress(Math.min((scrollTop / docHeight) * 100, 100))
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div
      className='fixed top-0 left-0 z-50 h-0.5 w-full origin-left bg-orange-500 transition-transform duration-75 ease-out'
      style={{ transform: `scaleX(${progress / 100})` }}
      role='progressbar'
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label='Progresso de leitura'
    />
  )
}
