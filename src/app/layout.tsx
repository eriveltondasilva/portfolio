import { Inter, Roboto_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import clsx from 'clsx'

import { Footer } from '@/components/footer'
import { BASE_URL } from '@/lib/constants'

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
  title: 'Erivelton Silva — Portfolio',
  siteName: "Erivelton's Portfolio",
  description:
    'Desenvolvedor Frontend apaixonado por React, Next.js e TypeScript. Artigos sobre frontend moderno e boas práticas.',
}

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: { default: meta.title, template: `%s — ${meta.siteName}` },
  description: meta.description,
  alternates: { canonical: BASE_URL },
  generator: 'Next.js',
  keywords: ['frontend', 'react', 'nextjs', 'typescript', 'blog'],
  authors: [{ name: 'Erivelton Silva', url: BASE_URL }],
  creator: 'Erivelton Silva',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    title: meta.title,
    description: meta.description,
    siteName: meta.siteName,
    url: BASE_URL,
  },
  twitter: {
    card: 'summary_large_image',
    title: meta.title,
    description: meta.description,
    site: meta.siteName,
    creator: '@erivelton_silv4',
  },
}

function TopBorder() {
  return (
    <div
      aria-hidden='true'
      className='h-0.5 w-full bg-linear-to-r from-orange-500 via-amber-400 to-orange-600'
    />
  )
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang='pt-BR'
      className={clsx(inter.variable, robotoMono.variable)}
      suppressHydrationWarning
    >
      <body className='flex min-h-screen flex-col bg-white font-sans antialiased dark:bg-[#0d1117]'>
        <TopBorder />
        <div className='flex-1'>{children}</div>
        <Footer />
        <Analytics />
      </body>
    </html>
  )
}
