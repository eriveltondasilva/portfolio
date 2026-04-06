'use client'

import Image from 'next/image'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { formatList, getGithubAvatar, getGitHubUsername, getInitials } from '@/lib'
import TwitterX from '@/assets/twitter-x.svg'
import Linkedin from '@/assets/linkedin.svg'
import Github from '@/assets/github.svg'

import type { Author } from '@/types'
import type { LucideIcon } from 'lucide-react'

const SOCIAL_ICONS = [
  {
    label: 'GitHub',
    key: 'github',
    icon: Github,
  },
  {
    label: 'Linkedin',
    key: 'linkedin',
    icon: Linkedin,
  },
  {
    label: 'Twitter',
    key: 'twitter',
    icon: TwitterX,
  },
] as const satisfies ReadonlyArray<{
  key: keyof Author['socials']
  label: string
  icon: LucideIcon
}>

function AuthorHoverCard({ author }: { author: Author }) {
  return (
    <HoverCard openDelay={300} closeDelay={100}>
      <HoverCardTrigger asChild>
        <span
          tabIndex={0}
          className='cursor-default underline decoration-dotted underline-offset-2 transition-colors hover:text-zinc-900 dark:hover:text-zinc-100'
        >
          {author.name}
        </span>
      </HoverCardTrigger>

      <HoverCardContent side='top' align='start' className='w-72 p-4' sideOffset={6}>
        {/* Header */}
        <div className='flex items-start gap-3'>
          <Avatar className='size-10 shrink-0 rounded-full border border-zinc-200 dark:border-zinc-700'>
            <AvatarImage src={getGithubAvatar(author)} alt={author.name} />
            <AvatarFallback className='bg-zinc-100 text-sm font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300'>
              {getInitials(author.name)}
            </AvatarFallback>
          </Avatar>

          <div className='min-w-0'>
            <p className='text-sm leading-tight font-semibold text-zinc-900 dark:text-zinc-50'>
              {author.name}
            </p>
            <p className='text-xs text-zinc-500 dark:text-zinc-400'>@{getGitHubUsername(author)}</p>
          </div>
        </div>

        {/* Bio */}
        <p className='mt-3 line-clamp-3 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400'>
          {author.bio}
        </p>

        {/* Skills */}
        {author.skills.length > 0 && (
          <div className='mt-3 flex flex-wrap gap-1'>
            {author.skills.slice(0, 3).map((skill) => (
              <Badge
                key={skill}
                variant='secondary'
                className='rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
              >
                {skill}
              </Badge>
            ))}
            {author.skills.length > 3 && (
              <Badge
                variant='secondary'
                className='rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400'
              >
                +{author.skills.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Social info */}
        <div className='mt-3 flex items-center gap-3 border-t border-zinc-100 pt-3 dark:border-zinc-700/60'>
          {SOCIAL_ICONS.map(({ key, label, icon }) => {
            const href = author.socials[key]

            if (!href) return null

            return (
              <a
                key={label}
                href={href}
                target='_blank'
                rel='noopener noreferrer'
                className='text-zinc-400 transition-colors hover:text-zinc-900 dark:hover:text-zinc-100'
              >
                <Image src={icon} alt={label} title={label} width={16} height={16} unoptimized />
              </a>
            )
          })}
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}

export function PostAuthors({ authors }: { authors: Author[] }) {
  if (authors.length === 0) return null

  const authorsBySlug = new Map(authors.map((author) => [author.slug, author]))
  const parts = formatList().formatToParts(authors.map((author) => author.slug))
  const authorNames = parts.map(({ type, value }, index) => {
    if (type === 'element') {
      const author = authorsBySlug.get(value)
      if (!author) return null
      return <AuthorHoverCard key={index} author={author} />
    }

    return <span key={index}>{value}</span>
  })

  return (
    <span className='flex flex-wrap items-baseline gap-x-1 text-sm text-zinc-500 dark:text-zinc-500'>
      <span>Criado por </span>
      {authorNames}
    </span>
  )
}
