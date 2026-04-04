'use client'

import { Tabs as TabsRoot, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

import type { ComponentProps } from 'react'

export function Tab({ children, ...props }: ComponentProps<typeof TabsContent>) {
  return <TabsContent {...props}>{children}</TabsContent>
}

interface TabsProps extends ComponentProps<typeof TabsRoot> {
  tabs: string[]
}

export function Tabs({ tabs, className, defaultValue, children, ...props }: TabsProps) {
  return (
    <TabsRoot
      className={cn('not-prose', className)}
      defaultValue={defaultValue || tabs[0]}
      {...props}
    >
      <TabsList>
        {tabs.map((tab) => (
          <TabsTrigger key={tab} value={tab}>
            {tab}
          </TabsTrigger>
        ))}
      </TabsList>

      {children}
    </TabsRoot>
  )
}
