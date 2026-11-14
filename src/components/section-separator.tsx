import { cn } from 'cn';

import { Separator } from '@/components/ui/separator';

import type { ComponentProps } from 'react';

export function SectionSeparator({
  className,
  ...props
}: ComponentProps<typeof Separator>) {
  return <Separator className={cn('my-8', className)} {...props} />;
}
