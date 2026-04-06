import { getPrimaryAuthor } from '@/lib/blog/authors'

import type { ComponentProps } from 'react'

function Link(props: ComponentProps<'a'>) {
  return (
    <a
      target='_blank'
      rel='noopener noreferrer'
      className='transition-colors hover:text-zinc-700 dark:hover:text-zinc-300'
      {...props}
    />
  )
}

export function Footer() {
  const author = getPrimaryAuthor()
  const year = new Date().getFullYear()

  return (
    <footer className='px-4 py-8 md:px-8 lg:px-12'>
      <div className='mt-6 flex flex-col gap-1 border-t border-zinc-100 pt-5 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800'>
        <p className='font-mono text-xs text-zinc-400 dark:text-zinc-500'>
          &copy; {year} {author.name}. Todos os direitos reservados.
        </p>
        <p className='font-mono text-xs text-zinc-400 dark:text-zinc-500'>
          Feito com <Link href='https://nextjs.org'>Next.js</Link>,{' '}
          <Link href='https://vercel.com'>Vercel</Link> e muito café ☕
        </p>
      </div>
    </footer>
  )
}
