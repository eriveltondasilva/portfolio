import '@/scss/main.scss'

import { Analytics } from '@vercel/analytics/react'
import { clsx } from 'clsx'
import { type Metadata } from 'next'
import { ThemeProvider } from 'next-themes'
import { JetBrains_Mono } from 'next/font/google'

import { Footer } from '@/components/footer'
import { Nav } from '@/components/nav'

import { meta, navItems } from '@/config'

const jetBrainsMono = JetBrains_Mono({ subsets: ['latin'], display: 'swap' })

export const metadata: Metadata = {
  metadataBase: new URL(meta.baseUrl),
  //
  title: {
    template: `%s | ${meta.title}`,
    default: meta.title,
  },
  description: meta.description,
  keywords: meta.keywords,
  authors: [{ name: meta.author, url: meta.github }],
  generator: 'Next.js',
  //
  openGraph: {
    type: 'website',
    //
    title: meta.title,
    description: meta.description,
    siteName: meta.title,
    url: meta.baseUrl,
    locale: meta.locale,
  },
}

type RootLayoutProps = { children: React.ReactNode }
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang={meta.locale} suppressHydrationWarning>
      <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
        <body
          className={clsx(
            'select-none antialiased',
            'flex h-screen items-center justify-center',
            'transition-colors duration-100 ease-out',
            'bg-white text-gray-900',
            'selection:bg-rose-300 selection:text-rose-900',
            'dark:bg-gray-900 dark:text-white',
            jetBrainsMono.className,
          )}
        >
          <div
            className={clsx(
              'flex h-full flex-col',
              'px-4 sm:px-8',
              'w-full min-w-[320px] max-w-[640px]',
            )}
          >
            <Nav items={navItems} />
            <main className='flex-1 select-text'>{children}</main>
            <Footer />
          </div>
          <Analytics />
        </body>
      </ThemeProvider>
    </html>
  )
}
