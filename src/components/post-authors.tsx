'use client'

import { Github, Linkedin, Twitter } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import { getGithubAvatar, getGitHubUsername, getInitials } from '@/lib'

import { Icon } from './icon'

import type { Author } from '@/types'

function AuthorHoverCard({ author }: { author: Author }) {
  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>
        <span className='cursor-default underline decoration-dotted underline-offset-2 transition-colors hover:text-zinc-900 dark:hover:text-zinc-100'>
          {author.name}
        </span>
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
            <AvatarImage src={getGithubAvatar(author)} alt={author.name} />
            <AvatarFallback className='bg-zinc-100 text-sm font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300'>
              {getInitials(author.name)}
            </AvatarFallback>
          </Avatar>

          <div className='min-w-0'>
            <p className='text-sm leading-tight font-semibold text-zinc-900 dark:text-zinc-50'>
              {author.name}
            </p>
            <p className='text-xs text-zinc-500 dark:text-zinc-400'>
              @{getGitHubUsername(author)}
            </p>
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

        {/* Socials */}
        {author.socials && (
          <div className='mt-3 flex items-center gap-3 border-t border-zinc-100 pt-3 dark:border-zinc-700/60'>
            {author.socials.github && (
              <a
                href={author.socials.github}
                target='_blank'
                rel='noopener noreferrer'
                className='text-zinc-400 transition-colors hover:text-zinc-900 dark:hover:text-zinc-100'
              >
                <Icon iconNode={Github} label='GitHub' className='size-3.5' />
              </a>
            )}
            {author.socials.linkedin && (
              <a
                href={author.socials.linkedin}
                target='_blank'
                rel='noopener noreferrer'
                className='text-zinc-400 transition-colors hover:text-zinc-900 dark:hover:text-zinc-100'
              >
                <Icon
                  iconNode={Linkedin}
                  label='LinkedIn'
                  className='size-3.5'
                />
              </a>
            )}
            {author.socials.twitter && (
              <a
                href={author.socials.twitter}
                target='_blank'
                rel='noopener noreferrer'
                className='text-zinc-400 transition-colors hover:text-zinc-900 dark:hover:text-zinc-100'
              >
                <Icon
                  iconNode={Twitter}
                  label='Twitter / X'
                  className='size-3.5'
                />
              </a>
            )}
          </div>
        )}
      </HoverCardContent>
    </HoverCard>
  )
}

export function PostAuthors({ authors }: { authors: Author[] }) {
  if (authors.length === 0) return null

  const authorsBySlug = new Map(authors.map((author) => [author.slug, author]))
  const parts = new Intl.ListFormat('pt-BR').formatToParts(
    authors.map((author) => author.slug),
  )

  return (
    <span className='flex flex-wrap items-baseline gap-x-0.5 text-sm text-zinc-500 dark:text-zinc-500'>
      <span className='mr-1'>criado por</span>
      {parts.map(({ type, value }, index) => {
        if (type === 'element')
          return (
            <AuthorHoverCard key={index} author={authorsBySlug.get(value)!} />
          )

        return <span key={index}>{value}</span>
      })}
    </span>
  )
}
