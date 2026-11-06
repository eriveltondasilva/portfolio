import { cva } from 'class-variance-authority';
import { cn } from 'cn';
import {
  AlertTriangleIcon,
  CheckCircleIcon,
  InfoIcon,
  XCircleIcon,
} from 'lucide-react';

import { RICH_TEXT_CLASSES } from './rich-text';

import type { VariantProps } from 'class-variance-authority';
import type { ReactNode } from 'react';

const calloutVariants = cva(
  'not-prose my-6 flex gap-3 rounded-lg border p-4 text-sm [&_a]:underline [&_a]:underline-offset-2',
  {
    variants: {
      variant: {
        info: 'border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300',
        tip: 'border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-300',
        warning:
          'border-yellow-500/30 bg-yellow-500/10 text-yellow-700 dark:text-yellow-300',
        danger:
          'border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300',
      },
    },
    defaultVariants: {
      variant: 'info',
    },
  },
);

const iconMap = {
  info: InfoIcon,
  tip: CheckCircleIcon,
  warning: AlertTriangleIcon,
  danger: XCircleIcon,
};

const labels = {
  info: 'Informação',
  tip: 'Dica',
  warning: 'Atenção',
  danger: 'Perigo',
} as const;

interface Props extends VariantProps<typeof calloutVariants> {
  title?: string;
  className?: string;
  children: ReactNode;
}

export function Callout({
  variant,
  title,
  className,
  children,
  ...props
}: Props) {
  const type = variant ?? 'info';
  const Icon = iconMap[type];

  return (
    <div
      role='note'
      aria-label={title ?? labels[type]}
      className={cn(calloutVariants({ variant: type }), className)}
      {...props}
    >
      <Icon className='size-5 shrink-0' aria-hidden='true' />
      <div className='flex flex-col gap-1'>
        {title && <p className='font-semibold'>{title}</p>}
        <div className={cn('[&_p]:leading-relaxed', RICH_TEXT_CLASSES)}>
          {children}
        </div>
      </div>
    </div>
  );
}
