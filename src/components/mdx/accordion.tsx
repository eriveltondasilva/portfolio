import {
  Accordion as AccordionRoot,
  AccordionItem as AccordionItemRoot,
  AccordionContent,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { cn } from '@/lib/utils'

import type { ComponentProps } from 'react'

type AccordionItemProps = ComponentProps<typeof AccordionItemRoot>

export function AccordionItem({
  title,
  value,
  children,
  ...props
}: AccordionItemProps) {
  return (
    <AccordionItemRoot value={value ?? title} {...props}>
      <AccordionTrigger>{title}</AccordionTrigger>
      <AccordionContent>{children}</AccordionContent>
    </AccordionItemRoot>
  )
}

type AccordionProps = ComponentProps<typeof AccordionRoot>

export function Accordion({
  type = 'single',
  className,
  children,
}: AccordionProps) {
  return (
    <AccordionRoot
      type={type}
      collapsible={type === 'single'}
      className={cn('not-prose', className)}
    >
      {children}
    </AccordionRoot>
  )
}
