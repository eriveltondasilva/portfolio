import { MapPinIcon } from 'lucide-react';
import Image from 'next/image';

import { getUrlPathname } from '@/lib/format';
import { getPrimaryAuthor } from '@/lib/blog/authors';
import { Icon } from '@/components/icon';
import { getAuthorSocialLinks } from '@/lib/social-links';
import { AUTHOR_LOCATION, AUTHOR_PRONOUNS } from '@/lib/constants';
import avatar from '@/assets/avatar.png';
import { getPlaceholder } from '@/lib/images';

export function ProfileSidebar() {
  const author = getPrimaryAuthor();
  const githubUsername = getUrlPathname(author.socials.github);
  const authorSocialLinks = getAuthorSocialLinks(author);

  return (
    <aside className='w-full shrink-0 md:w-64 lg:w-72'>
      {/* Avatar */}
      <Image
        src={avatar}
        alt={author.name}
        sizes='(min-width: 768px) 18rem, 5rem'
        placeholder={getPlaceholder(avatar)}
        className='aspect-square w-20 rounded-full border-2 border-border object-cover grayscale md:w-full'
        priority
      />

      {/* Name & username */}
      <div className='mt-4'>
        <p className='text-2xl leading-tight font-bold text-zinc-900 dark:text-zinc-50'>
          {author.name}
        </p>
        <p className='mt-0.5 text-xl font-light text-zinc-500 dark:text-zinc-400'>
          {githubUsername} • {AUTHOR_PRONOUNS}
        </p>
      </div>

      {/* Bio */}
      <p className='mt-4 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300'>
        {author.bio}
      </p>

      {/* Social Info */}
      <div className='mt-5 space-y-2 text-sm text-zinc-600 dark:text-zinc-400'>
        <div className='flex items-center gap-2'>
          <Icon iconNode={MapPinIcon} className='shrink-0' />
          <span>{AUTHOR_LOCATION}</span>
        </div>

        {authorSocialLinks.map(({ key, label, icon, href }) => (
          <a
            key={key}
            href={href}
            target='_blank'
            rel='noopener noreferrer'
            className='flex items-center gap-2 px-0.5 transition-colors hover:text-zinc-900 dark:hover:text-zinc-100'
          >
            <Image
              src={icon}
              alt={label}
              width={14}
              height={14}
              className='dark:invert'
            />
            <span className='truncate'>{getUrlPathname(href)}</span>
          </a>
        ))}
      </div>
    </aside>
  );
}
