import { cn } from 'cn';

import { Separator as SeparatorBase } from '@/components/ui/separator';

import type { ComponentProps } from 'react';

type SeparatorProps = ComponentProps<typeof SeparatorBase>;

export function Separator({ className, ...props }: SeparatorProps) {
  return (
    <SeparatorBase
      className={cn('my-10 dark:bg-zinc-700/60', className)}
      {...props}
    />
  );
}
