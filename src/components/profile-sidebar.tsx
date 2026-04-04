import { MapPinIcon } from 'lucide-react'
import Image from 'next/image'

import { getGithubAvatar, getGitHubUsername, getInitials } from '@/lib'
import TwitterX from '@/assets/twitter-x.svg'
import Linkedin from '@/assets/linkedin.svg'
import Github from '@/assets/github.svg'

import { Icon } from './icon'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Badge } from './ui/badge'

import type { Author } from '@/types'

const socialMap = [
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
  icon: string
}>

export function ProfileSidebar({ author }: { author: Author }) {
  return (
    <aside className='w-full shrink-0 md:w-64 lg:w-72'>
      {/* Avatar */}
      <div className='relative'>
        <Avatar className='size-20 rounded-full border-2 border-zinc-200 grayscale md:h-full md:w-full md:rounded-full dark:border-zinc-700'>
          <AvatarImage src={getGithubAvatar(author, 256)} alt={author.name} />
          <AvatarFallback className='bg-zinc-100 text-2xl font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300'>
            {getInitials(author.name)}
          </AvatarFallback>
        </Avatar>
      </div>

      {/* Name & username */}
      <div className='mt-4'>
        <h1 className='text-2xl leading-tight font-bold text-zinc-900 dark:text-zinc-50'>
          {author.name}
        </h1>
        <p className='mt-0.5 text-xl font-light text-zinc-500 dark:text-zinc-400'>
          {getGitHubUsername(author)} • ele/dele
        </p>
      </div>

      {/* Bio */}
      <p className='mt-4 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300'>{author.bio}</p>

      {/* Skills */}
      <div className='mt-4 flex flex-wrap gap-1.5'>
        {author.skills.map((skill) => (
          <Badge
            key={skill}
            variant='secondary'
            className='rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
          >
            {skill}
          </Badge>
        ))}
      </div>

      {/* Social Info */}
      <div className='mt-5 space-y-2 text-sm text-zinc-600 dark:text-zinc-400'>
        <div className='flex items-center gap-2'>
          <Icon iconNode={MapPinIcon} className='shrink-0' />
          <span>Alagoas, Brasil</span>
        </div>

        {socialMap.map(({ key, icon, label }) => {
          const href = author.socials[key]

          if (!href) return null

          return (
            <a
              key={label}
              href={href}
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center gap-2 transition-colors hover:text-zinc-900 dark:hover:text-zinc-100'
            >
              <Image src={icon} alt={label} width={16} height={16} unoptimized />
              <span className='truncate'>{label}</span>
            </a>
          )
        })}
      </div>
    </aside>
  )
}
