import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';

import { Footer } from '@/components/layout/footer';
import { TopBorder } from '@/components/layout/top-border';
import { TooltipProvider } from '@/components/ui/tooltip';
import {
  AUTHOR_NAME,
  LOCALE,
  OG_LOCALE,
  SITE_DESCRIPTION,
  SITE_NAME,
  TWITTER_HANDLE,
} from '@/lib/constants';
import { BASE_URL } from '@/lib/base-url';
import { ThemeProvider } from '@/components/theme/theme-provider';

import type { Metadata } from 'next';

import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  authors: [{ name: AUTHOR_NAME, url: BASE_URL }],
  creator: AUTHOR_NAME,
  alternates: {
    types: { 'application/rss+xml': '/feed.xml' },
  },
  openGraph: {
    type: 'website',
    url: '/',
    locale: OG_LOCALE,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    site: TWITTER_HANDLE,
    creator: TWITTER_HANDLE,
  },
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang={LOCALE}
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <body className='flex min-h-dvh flex-col font-sans antialiased'>
        <ThemeProvider>
          <TopBorder />

          <div className='flex-1'>
            <TooltipProvider>{children}</TooltipProvider>
          </div>

          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
