import Privacy from '@/content/pages/privacy.mdx';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de privacidade',
  description:
    'Quais dados o blog usa no recurso de reações, para que servem e por quanto tempo ficam guardados.',
  alternates: { canonical: '/privacy' },
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
