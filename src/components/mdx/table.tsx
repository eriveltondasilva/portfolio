import { cn } from 'cn';

import type { ComponentProps } from 'react';

export function Table({ className, ...props }: ComponentProps<'table'>) {
  return (
    <div className='my-6 scrollbar-thin [scrollbar-color:var(--border)_transparent] overflow-x-auto'>
      <table className={cn('my-0', className)} {...props} />
    </div>
  );
}
