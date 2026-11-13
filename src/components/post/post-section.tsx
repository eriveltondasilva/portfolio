import { useId } from 'react';

import { Icon } from '@/components/icon';
import { Separator } from '@/components/separator';

import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

interface Props {
  title: string;
  icon: LucideIcon;
  iconClassName: string;
  children: ReactNode;
}

export function PostSection({ title, icon, iconClassName, children }: Props) {
  const titleId = useId();

  return (
    <section aria-labelledby={titleId}>
      <Separator />

      <h2
        id={titleId}
        className='mb-3 flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-zinc-50'
      >
        <Icon iconNode={icon} className={iconClassName} />
        {title}
      </h2>

      {children}
    </section>
  );
}
