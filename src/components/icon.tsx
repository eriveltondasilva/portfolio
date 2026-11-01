import { cn } from 'cn';

import type { LucideIcon, LucideProps } from 'lucide-react';

interface Props extends LucideProps {
  iconNode: LucideIcon;
  label?: string;
}

export function Icon({
  iconNode: IconComp,
  className,
  label,
  ...props
}: Props) {
  return (
    <>
      <IconComp className={cn('size-4', className)} {...props} />
      {label && <span className='sr-only'>{label}</span>}
    </>
  );
}
