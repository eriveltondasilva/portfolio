import clsx from 'clsx'
import Image from 'next/image'

import { avatar, social } from '@/data'

export default function HomePage() {
  return (
    <section>
      <header>
        <a href={social.twitter} target='_blank'>
          <Image
            src={avatar || '/profile.png'}
            alt='Profile photo'
            className={clsx(
              'block rounded-full',
              'mx-auto mb-10 mt-0',
              'sm:float-right sm:mb-5 sm:ml-5',
              'lg:mb-5 lg:mt-5',
              'transition-[filter] duration-300 ease-in',
              'bg-gray-100 grayscale hover:grayscale-0',
            )}
            // unoptimized
            width={210}
            height={210}
            priority
          />
        </a>

        <h1 className='title'>Hi there 👋</h1>
      </header>

      <div className='prose prose-neutral dark:prose-invert'>
        <p>
          A clean, fast, and lightweight portfolio template built with Next.js,
          Vercel, and Tailwind CSS for optimal performance.
        </p>
        <p>
          Nextfolio includes all the essentials for a stunning portfolio: SEO,
          MDX support, RSS, Atom, & JSON feeds, analytics, tweet & YouTube
          embeds, KaTeX integration, and{' '}
          <a
            target='_blank'
            href='https://github.com/1msirius/Nextfolio?tab=readme-ov-file#features'
          >
            more
          </a>
          .
        </p>
      </div>
    </section>
  )
}
