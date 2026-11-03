import { ExternalLinkIcon } from 'lucide-react';
import LinkNext from 'next/link';
import { cn } from 'cn';

import { Icon } from '../icon';

import type { Route } from 'next';
import type { ComponentProps } from 'react';

const isHttpUrl = (str: string) => /^https?:\/\//.test(str);

export function Link({
  href = '',
  className,
  children,
  ...props
}: ComponentProps<'a'>) {
  if (!href) return children;

  // # Internal link
  if (href.startsWith('/') && !href.startsWith('//')) {
    return (
      <LinkNext href={href as Route} className={className} {...props}>
        {children}
      </LinkNext>
    );
  }

  // # External link
  if (isHttpUrl(href)) {
    return (
      <a
        href={href}
        target='_blank'
        rel='noopener noreferrer'
        className={cn(className, 'group')}
        {...props}
      >
        {children}
        <Icon
          iconNode={ExternalLinkIcon}
          label='(abre em nova aba)'
          className='ml-1 inline size-3.5 align-text-top group-hover:animate-bounce'
        />
      </a>
    );
  }

  return (
    <a href={href} className={className} {...props}>
      {children}
    </a>
  );
}
