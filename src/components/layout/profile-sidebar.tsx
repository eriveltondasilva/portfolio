import { MapPinIcon } from 'lucide-react';
import Image from 'next/image';

import {
  getGitHubAvatarUrl,
  getNameInitials,
  getUrlPathname,
} from '@/lib/format';
import { getPrimaryAuthor } from '@/lib/blog/authors';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Icon } from '@/components/icon';
import { SOCIAL_LINKS } from '@/lib/social-links';

const AVATAR_SIZE = 200;

export function ProfileSidebar() {
  const author = getPrimaryAuthor();
  const githubUsername = getUrlPathname(author.socials.github);

  return (
    <aside className='w-full shrink-0 md:w-64 lg:w-72'>
      {/* Avatar */}
      <div className='relative'>
        <Avatar className='size-20 rounded-full border-2 border-zinc-200 grayscale md:size-full dark:border-zinc-700'>
          <AvatarImage
            src={getGitHubAvatarUrl(author, AVATAR_SIZE)}
            alt={author.name}
          />
          <AvatarFallback className='bg-zinc-100 text-2xl font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300'>
            {getNameInitials(author.name)}
          </AvatarFallback>
        </Avatar>
      </div>

      {/* Name & username */}
      <div className='mt-4'>
        <p className='text-2xl leading-tight font-bold text-zinc-900 dark:text-zinc-50'>
          {author.name}
        </p>
        <p className='mt-0.5 text-xl font-light text-zinc-500 dark:text-zinc-400'>
          {githubUsername} • ele/dele
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
          <span>Alagoas, Brasil</span>
        </div>

        {SOCIAL_LINKS.map(({ key, label, icon }) => {
          const href = author.socials[key];

          if (!href) return null;

          return (
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
                unoptimized
              />
              <span className='truncate'>{getUrlPathname(href)}</span>
            </a>
          );
        })}
      </div>
    </aside>
  );
}
