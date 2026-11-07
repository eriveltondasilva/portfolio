import { DotIcon } from 'lucide-react';
import NextLink from 'next/link';

import { Icon } from '@/components/icon';

import type { ComponentProps } from 'react';

const LINK_CLASSES =
  'transition-colors hover:text-zinc-700 dark:hover:text-zinc-300';

function ExternalLink(props: ComponentProps<'a'>) {
  return (
    <a
      target='_blank'
      rel='noopener noreferrer'
      className={LINK_CLASSES}
      {...props}
    />
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className='px-4 pb-8 md:px-8 lg:px-12'>
      <div className='mt-6 flex flex-col items-center gap-1 border-t border-zinc-100 pt-5 text-center font-mono text-xs text-zinc-500 lg:flex-row lg:justify-between dark:border-zinc-800 dark:text-zinc-400'>
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
          <ExternalLink href='https://nextjs.org'>Next.js</ExternalLink>,{' '}
          <ExternalLink href='https://vercel.com'>Vercel</ExternalLink> e muito
          café ☕
        </p>
      </div>
    </footer>
  );
}
