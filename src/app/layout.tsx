import { Inter, Roboto_Mono } from 'next/font/google';

import { Footer } from '@/components/footer';
import { TopBorder } from '@/components/top-border';
import { TooltipProvider } from '@/components/ui/tooltip';
import { BASE_URL, SITE_NAME, TWITTER_HANDLE } from '@/lib/constants';

import './globals.css';

import type { Metadata } from 'next';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const robotoMono = Roboto_Mono({
  variable: '--font-roboto-mono',
  subsets: ['latin'],
  display: 'swap',
});

const SITE_TITLE = 'Erivelton Silva - Portfolio';
const SITE_DESCRIPTION =
  'Desenvolvedor Frontend apaixonado por React, Next.js e TypeScript. Artigos sobre frontend moderno e boas práticas.';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: { default: SITE_TITLE, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  authors: [{ name: 'Erivelton Silva', url: BASE_URL }],
  creator: 'Erivelton Silva',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: TWITTER_HANDLE,
    creator: TWITTER_HANDLE,
  },
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang='pt-BR' className={`${inter.variable} ${robotoMono.variable}`}>
      <body className='flex min-h-dvh flex-col font-sans antialiased'>
        <TopBorder />
        <div className='flex-1'>
          <TooltipProvider>{children}</TooltipProvider>
        </div>
        <Footer />
      </body>
    </html>
  );
}
