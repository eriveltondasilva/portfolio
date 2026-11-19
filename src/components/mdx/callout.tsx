import { cn } from 'cn';
import { AlertTriangleIcon, CheckCircleIcon, InfoIcon, XCircleIcon } from 'lucide-react';

import { Icon } from '@/components/icon';
import { tw } from '@/lib/tw';

import { PROSE_RESET_CLASSES } from './prose';

import type { ReactNode } from 'react';

// ─────────────────────────────────────

const calloutConfig = {
  info: {
    label: 'Informação',
    icon: InfoIcon,
    classes: tw`border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300`,
  },
  tip: {
    label: 'Dica',
    icon: CheckCircleIcon,
    classes: tw`border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-300`,
  },
  warning: {
    label: 'Atenção',
    icon: AlertTriangleIcon,
    classes: tw`border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300`,
  },
  danger: {
    label: 'Perigo',
    icon: XCircleIcon,
    classes: tw`border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300`,
  },
} as const;

// ─────────────────────────────────────

interface Props {
  variant?: keyof typeof calloutConfig;
  title?: string;
  className?: string;
  children: ReactNode;
}

export function Callout({ variant = 'info', title, className, children, ...props }: Props) {
  const { icon, label, classes } = calloutConfig[variant];

  return (
    <div
      role='note'
      aria-label={title ?? label}
      className={cn(
        'not-prose my-6 flex gap-3 rounded-lg border p-4 text-sm [&_a]:underline [&_a]:underline-offset-2',
        classes,
        className,
      )}
      {...props}
    >
      <Icon iconNode={icon} className='size-5 shrink-0' />

      <div className='flex flex-col gap-1'>
        {title && <p className='font-semibold'>{title}</p>}

        <div className={cn('[&_p]:leading-relaxed', PROSE_RESET_CLASSES)}>{children}</div>
      </div>
    </div>
  );
}
