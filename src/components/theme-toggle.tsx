'use client'
import { useTheme } from '@/hooks/useTheme'
import clsx from 'clsx'
import { Moon, Sun } from 'lucide-react'

export function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className={clsx(
        'rounded-lg p-2 transition-colors duration-200',
        'hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-blue-400',
        isDark ? 'bg-gray-800 text-yellow-300' : 'bg-blue-100 text-gray-800',
      )}
    >
      {isDark ? <Sun className='size-5' /> : <Moon className='size-5' />}
    </button>
  )
}

// export function ThemeToggle() {
//   const [theme, setTheme] = useState('')

//   useEffect(() => {
//     const savedTheme = localStorage.getItem('theme') || 'light'
//     setTheme(savedTheme)
//     document.documentElement.classList.toggle('dark', savedTheme === 'dark')
//   }, [])

//   const toggleTheme = () => {
//     const newTheme = theme === 'dark' ? 'light' : 'dark'
//     setTheme(newTheme)
//     localStorage.setItem('theme', newTheme)
//     document.documentElement.classList.toggle('dark', newTheme === 'dark')
//   }

//   return (
//     <button
//       onClick={toggleTheme}
//       className='rounded-md bg-gray-700 p-2 transition-colors dark:bg-gray-500'
//     >
//       {theme === 'dark' ? (
//         <Sun className='size-5' />
//       ) : (
//         <Moon className='size-5' />
//       )}
//     </button>
//   )
// }
