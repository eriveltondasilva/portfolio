import { ExternalLinkIcon } from 'lucide-react'
import LinkNext from 'next/link'

import { cn } from '@/lib/utils'

import { Icon } from '../icon'

import type { ComponentProps } from 'react'
import type { Route } from 'next'

export function Link({ href = '', children, ...props }: ComponentProps<'a'>) {
  if (!href) return <>{children}</>

  if (href.startsWith('/')) {
    return (
      <LinkNext href={href as Route} {...props}>
        {children}
      </LinkNext>
    )
  }

  if (href.startsWith('#')) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    )
  }

  if (href.startsWith('mailto:') || href.startsWith('tel:')) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    )
  }

  if (href.startsWith('http://') || href.startsWith('https://')) {
    return (
      <a
        href={href}
        target='_blank'
        rel='noopener noreferrer'
        {...props}
        className={cn('inline-flex items-center gap-1', props.className)}
      >
        {children}
        <Icon iconNode={ExternalLinkIcon} />
      </a>
    )
  }

  return (
    <LinkNext href={href as Route} {...props}>
      {children}
    </LinkNext>
  )
}
