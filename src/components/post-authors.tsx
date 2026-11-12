import Image from 'next/image';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import {
  createListFormatter,
  getGitHubAvatarUrl,
  getNameInitials,
  getUrlPathname,
} from '@/lib/format';
import { SOCIAL_LINKS } from '@/lib/social-links';

import type { Author } from '@/types';

const MAX_VISIBLE_SKILLS = 3;
const AVATAR_SIZE = 80;

function AuthorHoverCard({ author }: { author: Author }) {
  const githubUsername = getUrlPathname(author.socials.github);
  const authorSkillsCount = author.skills.length;

  return (
    <HoverCard openDelay={300} closeDelay={100}>
      <HoverCardTrigger asChild>
        <a
          href={author.socials.github}
          target='_blank'
          rel='noopener noreferrer'
          className='underline decoration-dotted underline-offset-2 transition-colors hover:text-zinc-900 dark:hover:text-zinc-100'
        >
          {author.name}
        </a>
      </HoverCardTrigger>

      <HoverCardContent
        side='top'
        align='start'
        className='w-72 p-4'
        sideOffset={6}
      >
        {/* Header */}
        <div className='flex items-start gap-3'>
          <Avatar className='size-10 shrink-0 rounded-full border border-zinc-200 dark:border-zinc-700'>
            <AvatarImage
              src={getGitHubAvatarUrl(author, AVATAR_SIZE)}
              alt={author.name}
            />

            <AvatarFallback className='bg-zinc-100 text-sm font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300'>
              {getNameInitials(author.name)}
            </AvatarFallback>
          </Avatar>

          <div className='min-w-0'>
            <p className='text-sm leading-tight font-semibold text-zinc-900 dark:text-zinc-50'>
              {author.name}
            </p>

            <p className='text-xs text-zinc-500 dark:text-zinc-400'>
              @{githubUsername}
            </p>
          </div>
        </div>

        {/* Bio */}
        <p className='mt-3 line-clamp-3 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400'>
          {author.bio}
        </p>

        {/* Skills */}
        {authorSkillsCount > 0 && (
          <div className='mt-3 flex flex-wrap gap-1'>
            {author.skills.slice(0, MAX_VISIBLE_SKILLS).map((skill) => (
              <Badge
                key={skill}
                variant='secondary'
                className='rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
              >
                {skill}
              </Badge>
            ))}
            {authorSkillsCount > MAX_VISIBLE_SKILLS && (
              <Badge
                variant='secondary'
                className='rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400'
              >
                +{authorSkillsCount - MAX_VISIBLE_SKILLS}
              </Badge>
            )}
          </div>
        )}

        {/* Social info */}
        <div className='mt-3 flex items-center gap-x-1 border-t border-zinc-100 pt-3 dark:border-zinc-700/60'>
          {SOCIAL_LINKS.map(({ key, label, icon }) => {
            const href = author.socials[key];

            if (!href) return null;

            return (
              <a
                key={label}
                href={href}
                target='_blank'
                rel='noopener noreferrer'
                className='rounded-md px-2 py-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100'
              >
                <Image
                  src={icon}
                  alt={label}
                  title={label}
                  width={16}
                  height={16}
                  className='dark:invert'
                  unoptimized
                />
              </a>
            );
          })}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

export function PostAuthors({ authors }: { authors: Author[] }) {
  const authorsBySlug = new Map(authors.map((author) => [author.slug, author]));
  const parts = createListFormatter().formatToParts(
    authors.map((author) => author.slug),
  );
  const authorNames = parts.map(({ type, value }, index) => {
    if (type === 'element') {
      const author = authorsBySlug.get(value);
      if (!author) return null;
      return <AuthorHoverCard key={index} author={author} />;
    }

    return <span key={index}>{value}</span>;
  });

  return authorNames;
}
