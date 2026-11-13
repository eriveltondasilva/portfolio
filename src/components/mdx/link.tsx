import { ArrowUpRightIcon } from 'lucide-react';
import LinkNext from 'next/link';

import { Icon } from '@/components/icon';

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
      <a href={href} target='_blank' rel='noopener noreferrer' {...props}>
        {children}

        <Icon
          iconNode={ArrowUpRightIcon}
          label='(abre em nova aba)'
          className='inline size-3.5 align-text-top'
        />
      </a>
    );
  }

  // # Relative link
  return (
    <a href={href} {...props}>
      {children}
    </a>
  );
}
