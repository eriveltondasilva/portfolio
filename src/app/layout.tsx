import { Inter, Roboto_Mono } from 'next/font/google'
import clsx from 'clsx'

import { URL_BASE } from '#/lib/constants'

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

const meta = {
  title: 'Erivelton Silva — Dev Blog',
  description:
    'Desenvolvedor Frontend apaixonado por React, Next.js e TypeScript. Artigos sobre frontend moderno e boas práticas.',
}

export const metadata: Metadata = {
  metadataBase: new URL(URL_BASE),
  title: {
    default: meta.title,
    template: '%s — Erivelton Silva',
  },
  description: meta.description,
  openGraph: {
    title: meta.title,
    description: meta.description,
    url: URL_BASE,
    siteName: 'Erivelton Silva',
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    title: meta.title,
    description: meta.description,
    card: 'summary_large_image',
    creator: '@erivelton_silv4',
  },
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang='pt-BR'
      className={clsx(inter.variable, robotoMono.variable)}
      suppressHydrationWarning
    >
      <body className='min-h-screen bg-white font-sans antialiased dark:bg-[#0d1117]'>
        {/* Top border accent */}
        <div className='h-0.5 w-full bg-linear-to-r from-orange-500 via-amber-400 to-orange-600' />
        {children}
      </body>
    </html>
  )
}
