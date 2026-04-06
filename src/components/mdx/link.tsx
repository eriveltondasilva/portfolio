import { ExternalLinkIcon } from 'lucide-react'
import LinkNext from 'next/link'

import { Icon } from '../icon'

import type { ComponentPropsWithoutRef } from 'react'
import type { Route } from 'next'

const isHttpUrl = (str: string) => /^https?:\/\//.test(str)

export function Link({ href = '', children, ...props }: ComponentPropsWithoutRef<'a'>) {
  if (!href) return <>{children}</>

  if (href.startsWith('/')) {
    return (
      <LinkNext href={href as Route} {...props}>
        {children}
      </LinkNext>
    )
  }

  if (isHttpUrl(href)) {
    return (
      <a
        href={href}
        target='_blank'
        rel='noopener noreferrer'
        {...props}
        className='inline-flex items-center gap-1'
      >
        {children}
        <Icon iconNode={ExternalLinkIcon} className='size-3.5' />
      </a>
    )
  }

  return (
    <a href={href} {...props}>
      {children}
    </a>
  )
}
