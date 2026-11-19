import { ArrowUpRightIcon } from 'lucide-react';
import LinkNext from 'next/link';

import { Icon } from '@/components/icon';
import { ExternalLink } from '@/components/external-link';

import type { Route } from 'next';
import type { ComponentProps } from 'react';

const isHttpUrl = (str: string) => /^https?:\/\//.test(str);

export function Link({ href = '', children, ...props }: ComponentProps<'a'>) {
  if (!href) return children;

  // # Internal link
  if (href.startsWith('/') && !href.startsWith('//')) {
    return (
      <LinkNext href={href as Route} {...props}>
        {children}
      </LinkNext>
    );
  }

  // # External link
  if (isHttpUrl(href)) {
    return (
      <ExternalLink href={href} {...props}>
        {children}
        <Icon iconNode={ArrowUpRightIcon} className='inline size-3 align-text-top' />
      </ExternalLink>
    );
  }

  // # Relative link
  return (
    <a href={href} {...props}>
      {children}
    </a>
  );
}
