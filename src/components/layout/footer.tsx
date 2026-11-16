import { CoffeeIcon, DotIcon } from 'lucide-react';
import NextLink from 'next/link';

import { Icon } from '@/components/icon';
import { ExternalLink } from '@/components/external-link';
import { tw } from '@/lib/tw';

const BRAND_NAME = 'Erivelton';
const LINK_CLASSES = tw`transition-colors hover:text-foreground`;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className='px-4 md:px-8 lg:px-12'>
      <div className='mt-6 flex flex-col items-center gap-1 border-t pt-5 text-center font-mono text-xs text-muted-foreground lg:flex-row lg:justify-between'>
        <div className='flex flex-col items-center sm:flex-row'>
          <p className='flex items-center'>
            <span>&copy; {year}</span>
            <Icon iconNode={DotIcon} />
            <span>Todos os direitos reservados</span>
          </p>

          <Icon iconNode={DotIcon} className='hidden sm:block' />

          <nav aria-label='Rodapé' className='flex items-center'>
            <NextLink href='/privacy' className={LINK_CLASSES}>
              Privacidade
            </NextLink>

            <Icon iconNode={DotIcon} />

            <a href='/feed.xml' className={LINK_CLASSES}>
              RSS
            </a>
          </nav>
        </div>

        <p>
          Feito com{' '}
          <ExternalLink href='https://nextjs.org' className={LINK_CLASSES}>
            Next.js
          </ExternalLink>
          ,{' '}
          <ExternalLink href='https://vercel.com' className={LINK_CLASSES}>
            Vercel
          </ExternalLink>{' '}
          e muito café{' '}
          <Icon iconNode={CoffeeIcon} className='inline align-text-bottom' />
        </p>
      </div>

      {/* Decorative: the name already appears elsewhere on the site */}
      <div
        aria-hidden='true'
        className='@container mt-8 overflow-hidden select-none'
      >
        <p className='mb-[-0.15em] bg-brand-gradient bg-clip-text text-[26cqw] leading-none font-semibold tracking-tighter whitespace-nowrap text-transparent'>
          {BRAND_NAME}
        </p>
      </div>
    </footer>
  );
}
