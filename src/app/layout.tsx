import './globals.css'

import { Analytics } from '@vercel/analytics/react'
import { clsx } from 'clsx'
import { JetBrains_Mono } from 'next/font/google'

import { Nav } from '@/components/nav'
import { meta } from './data'
import Footer from '@/components/footer'

const jetBrainsMono = JetBrains_Mono({ subsets: ['latin'], display: 'swap' })

export const metadata = {
  title: {
    default: meta.title,
    template: `%s | ${meta.title}`,
  },
  description: meta.description,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='pt-br' className=''>
      <body
        className={clsx(
          'antialiased',
          'flex flex-col items-center justify-center',
          'mx-auto mb-20 mt-2 lg:mb-40 lg:mt-8',
          'transition-colors duration-100 ease-in-out',
          'bg-white dark:text-white',
          'text-gray-900 dark:bg-gray-900',
          jetBrainsMono.className,
        )}
      >
        <main
          className={clsx(
            'flex flex-auto flex-col',
            'w-full min-w-0 max-w-[640px]',
            'mt-2 px-6 sm:px-4 md:mt-6 md:px-0',
          )}
        >
          <Nav />
          {children}
          <Footer />
        </main>
        <Analytics />
      </body>
    </html>
  )
}
