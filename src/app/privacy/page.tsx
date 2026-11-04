import Privacy from '@/content/pages/privacy.mdx';
import { OG_LOCALE, SITE_NAME, TWITTER_HANDLE } from '@/lib/constants';

import type { Metadata } from 'next';

const meta = {
  title: 'Política de privacidade',
  description:
    'Quais dados o blog usa no recurso de reações, para que servem e por quanto tempo ficam guardados.',
};

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: '/privacy' },
  openGraph: {
    type: 'website',
    url: '/privacy',
    locale: OG_LOCALE,
    siteName: SITE_NAME,
    title: meta.title,
    description: meta.description,
  },
  twitter: {
    card: 'summary',
    title: meta.title,
    description: meta.description,
    site: TWITTER_HANDLE,
    creator: TWITTER_HANDLE,
  },
};

export default function PrivacyPage() {
  return (
    <main className='mx-auto max-w-3xl px-4 py-8 md:px-8'>
      <article className='prose max-w-none prose-zinc dark:prose-invert'>
        <Privacy />
      </article>
    </main>
  );
}
