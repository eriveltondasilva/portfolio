import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'

import { avatar, social } from '@/data'

export default function HomePage() {
  return (
    <section>
      <a href={social.twitter} target='_blank'>
        <Image
          src={avatar || '/profile.png'}
          alt='Profile photo'
          className={clsx(
            'block rounded-full',
            'mx-auto mb-10 mt-0',
            'sm:float-right sm:mb-5 sm:ml-5',
            'lg:mb-5 lg:mt-5',
            'transition duration-500 ease-in-out',
            'bg-gray-100 grayscale hover:grayscale-0',
          )}
          // unoptimized
          width={180}
          height={180}
          priority
        />
      </a>

      <h1 className='mb-8 text-2xl font-medium tracking-tight'>
        Portfolio, made simple!
      </h1>

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
        <p>
          Nextfolio is{' '}
          <a href={social.github} target='_blank'>
            open-source
          </a>{' '}
          and fully customizable, making it easy to add more features.
        </p>
        <p>
          <a
            href='https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2F1msirius%2FNextfolio'
            target='_blank'
          >
            Deploy
          </a>{' '}
          your Nextfolio site with Vercel in minutes and follow the set up
          instructions in the{' '}
          <Link href='/blog/getting-started'>Getting Started</Link> post.
        </p>
        <p>
          Built and maintained by{' '}
          <a href='https://imsirius.xyz/' target='_blank'>
            Sirius
          </a>
          .
        </p>
      </div>
    </section>
  )
}
