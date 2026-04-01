// 'use client'

// import { useEffect, useState } from 'react'

// import { cn } from '@/lib/utils'

// import type { Heading } from '@/lib/headings'

// interface Props {
//   headings: Heading[]
// }

// export function TableOfContents({ headings }: Props) {
//   const [activeId, setActiveId] = useState('')

//   useEffect(() => {
//     if (headings.length === 0) return

//     const observer = new IntersectionObserver(
//       (entries) => {
//         for (const entry of entries) {
//           if (entry.isIntersecting) {
//             setActiveId(entry.target.id)
//           }
//         }
//       },
//       { rootMargin: '0% 0% -80% 0%' },
//     )

//     for (const { id } of headings) {
//       const el = document.getElementById(id)
//       if (el) observer.observe(el)
//     }

//     return () => observer.disconnect()
//   }, [headings])

//   if (headings.length === 0) return null

//   return (
//     <nav aria-label='Índice do post'>
//       <p className='mb-3 text-xs font-semibold tracking-widest text-zinc-400 uppercase dark:text-zinc-500'>
//         Neste post
//       </p>

//       <ul className='border-l border-zinc-200 dark:border-zinc-700/60'>
//         {headings.map(({ id, text, level }) => (
//           <li key={id}>
//             <a
//               href={`#${id}`}
//               className={cn(
//                 '-ml-px block border-l py-1 text-sm transition-colors',
//                 level === 2 ? 'pl-3' : 'pl-6',
//                 activeId === id ?
//                   'border-orange-500 font-medium text-zinc-900 dark:text-zinc-50'
//                 : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200',
//               )}
//               onClick={(e) => {
//                 e.preventDefault()
//                 document
//                   .getElementById(id)
//                   ?.scrollIntoView({ behavior: 'smooth' })
//               }}
//             >
//               {text}
//             </a>
//           </li>
//         ))}
//       </ul>
//     </nav>
//   )
// }
