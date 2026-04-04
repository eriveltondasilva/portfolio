import { ExternalLinkIcon } from 'lucide-react'
import LinkNext from 'next/link'

import { Icon } from '../icon'

import type { ComponentPropsWithoutRef } from 'react'
import type { Route } from 'next'

const EXTERNAL_PROTOCOLS = ['http://', 'https://', 'www.']

export function Link({ href = '', children, ...props }: ComponentPropsWithoutRef<'a'>) {
  if (!href) return <>{children}</>

  if (href.startsWith('/')) {
    return (
      <LinkNext href={href as Route} {...props}>
        {children}
      </LinkNext>
    )
  }

  if (EXTERNAL_PROTOCOLS.some((protocol) => href.startsWith(protocol))) {
    return (
      <a
        href={href}
        target='_blank'
        rel='noopener noreferrer'
        {...props}
        className='inline-flex items-center gap-1'
      >
        {children}
        <Icon iconNode={ExternalLinkIcon} />
      </a>
    )
  }

  return (
    <a href={href} {...props}>
      {children}
    </a>
  )
}
