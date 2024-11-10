import '@/scss/main.scss'

import { Analytics } from '@vercel/analytics/react'
import { clsx } from 'clsx'
import { ThemeProvider } from 'next-themes'
import { JetBrains_Mono } from 'next/font/google'

import Footer from '@/components/footer'
import { Nav } from '@/components/nav'
import { meta, navItems } from '@/data'

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
    <html lang='en' suppressHydrationWarning>
      <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
        <body
          className={clsx(
            'antialiased',
            'flex h-screen items-center justify-center',
            'transition-colors duration-100 ease-out',
            'bg-white text-gray-900',
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
            <main className='flex-1'>{children}</main>
            <Footer />
          </div>
          <Analytics />
        </body>
      </ThemeProvider>
    </html>
  )
}
