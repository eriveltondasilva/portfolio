import { Inter, Roboto_Mono } from 'next/font/google'
import clsx from 'clsx'

import { ProfileSidebar } from '@/components/profile-sidebar'
import { TabsNav } from '@/components/tabs-nav'
import { getAuthorBySlug } from '@/lib/blog'
import { PRIMARY_AUTHOR_SLUG } from '@/lib/constants'

import './globals.css'

import type { Metadata } from 'next'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

const robotoMono = Roboto_Mono({
  variable: '--font-roboto-mono',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Erivelton Silva — Dev Blog',
    template: '%s — Erivelton Silva',
  },
  description:
    'Desenvolvedor Frontend apaixonado por React, Next.js e TypeScript. Artigos sobre frontend moderno e boas práticas.',
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  const author = getAuthorBySlug(PRIMARY_AUTHOR_SLUG)

  if (!author) throw new Error('Author not found')

  return (
    <html
      lang='pt-BR'
      className={clsx(inter.variable, robotoMono.variable)}
      suppressHydrationWarning
    >
      <body className='min-h-screen bg-white font-sans antialiased dark:bg-[#0d1117]'>
        {/* Top border accent */}
        <div className='h-0.5 w-full bg-linear-to-r from-orange-500 via-amber-400 to-orange-600' />

        <div className='mx-auto max-w-7xl px-4 py-8 md:px-8 lg:px-12'>
          <div className='flex flex-col gap-8 md:flex-row md:items-start md:gap-10 lg:gap-14'>
            {/* Sidebar - fixed on desktop */}
            <ProfileSidebar author={author} />

            {/* Main content area */}
            <main className='min-w-0 flex-1'>
              <TabsNav />
              <div className='py-6'>{children}</div>
            </main>
          </div>
        </div>
      </body>
    </html>
  )
}
