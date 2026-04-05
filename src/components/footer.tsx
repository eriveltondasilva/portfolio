import { getPrimaryAuthor } from '@/lib/blog/authors'

export function Footer() {
  const author = getPrimaryAuthor()
  const year = new Date().getFullYear()

  return (
    <footer>
      <div className='mx-auto max-w-7xl px-4 py-8 md:px-8 lg:px-12'>
        {/* Bottom bar */}
        <div className='mt-6 flex flex-col gap-1 border-t border-zinc-100 pt-5 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800'>
          <p className='font-mono text-xs text-zinc-400 dark:text-zinc-500'>
            © {year} {author.name}. Todos os direitos reservados.
          </p>
          <p className='font-mono text-xs text-zinc-400 dark:text-zinc-500'>
            Feito com{' '}
            <a
              href='https://nextjs.org'
              target='_blank'
              rel='noopener noreferrer'
              className='transition-colors hover:text-zinc-700 dark:hover:text-zinc-300'
            >
              Next.js
            </a>{' '}
            e{' '}
            <a
              href='https://mdxjs.com'
              target='_blank'
              rel='noopener noreferrer'
              className='transition-colors hover:text-zinc-700 dark:hover:text-zinc-300'
            >
              MDX
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
