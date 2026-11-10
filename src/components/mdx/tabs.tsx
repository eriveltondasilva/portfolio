import { Children, isValidElement } from 'react';
import { cn } from 'cn';

import {
  Tabs as TabsRoot,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

import { RICH_TEXT_CLASSES } from './rich-text';

import type { ComponentProps, ReactNode } from 'react';

// ─────────────────────────────────────

function getTabLabels(children: ReactNode): string[] {
  const labels = Children.toArray(children).flatMap((child) =>
    (
      isValidElement<{ label?: unknown }>(child) &&
      typeof child.props.label === 'string'
    ) ?
      [child.props.label]
    : [],
  );

  const labelCount = labels.length;

  if (labelCount === 0) {
    throw new Error('<Tabs> needs at least one <Tab label="...">.');
  }

  if (new Set(labels).size !== labelCount) {
    throw new Error(`<Tabs> has duplicated tab labels: ${labels.join(', ')}`);
  }

  return labels;
}

// ─────────────────────────────────────

export function Tabs({
  className,
  defaultValue,
  children,
  ...props
}: ComponentProps<typeof TabsRoot>) {
  const labels = getTabLabels(children);

  return (
    <TabsRoot
      className={cn('not-prose', className)}
      defaultValue={defaultValue || labels[0]}
      {...props}
    >
      <TabsList>
        {labels.map((label) => (
          <TabsTrigger key={label} value={label}>
            {label}
          </TabsTrigger>
        ))}
      </TabsList>

      {children}
    </TabsRoot>
  );
}

// ─────────────────────────────────────

interface TabProps extends Omit<ComponentProps<typeof TabsContent>, 'value'> {
  label: string;
}

export function Tab({ label, className, children, ...props }: TabProps) {
  return (
    <TabsContent
      value={label}
      className={cn(RICH_TEXT_CLASSES, className)}
      {...props}
    >
      {children}
    </TabsContent>
  );
}
