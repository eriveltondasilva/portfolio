'use client'

import {
  Tabs as TabsRoot,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '#/components/ui/tabs'
import { cn } from '#/lib/utils'

import type { ComponentProps } from 'react'

interface TabsProps extends Omit<ComponentProps<'div'>, 'children'> {
  items: string[]
  defaultIndex?: number
  children: React.ReactNode[]
}

export function Tabs({
  items,
  className,
  defaultIndex = 0,
  children,
  ...props
}: TabsProps) {
  return (
    <TabsRoot
      // @ts-expect-error TODO: fix
      defaultValue={String(defaultIndex)}
      className={cn('not-prose', className)}
      {...props}
    >
      <TabsList>
        {items.map((item, index) => (
          <TabsTrigger key={item} value={String(index)}>
            {item}
          </TabsTrigger>
        ))}
      </TabsList>

      {children.map((child, index) => (
        <TabsContent key={index} value={String(index)}>
          {child}
        </TabsContent>
      ))}
    </TabsRoot>
  )
}
