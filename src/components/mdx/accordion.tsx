import {
  Accordion as AccordionRoot,
  AccordionItem as AccordionItemRoot,
  AccordionContent,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { cn } from '@/lib/utils'

import type { ComponentProps } from 'react'

interface AccordionItemProps extends Omit<ComponentProps<typeof AccordionItemRoot>, 'value'> {
  title: string
  value?: string
}

export function AccordionItem({ title, value, children, ...props }: AccordionItemProps) {
  return (
    <AccordionItemRoot value={value ?? title} {...props}>
      <AccordionTrigger>{title}</AccordionTrigger>
      <AccordionContent>{children}</AccordionContent>
    </AccordionItemRoot>
  )
}

interface AccordionBaseProps {
  className?: string
  children: React.ReactNode
}

type AccordionProps =
  | (AccordionBaseProps & { type?: 'single' })
  | (AccordionBaseProps & { type: 'multiple' })

export function Accordion({ type = 'single', className, children }: AccordionProps) {
  const sharedProps = { className: cn('not-prose', className) }

  if (type === 'multiple') {
    return (
      <AccordionRoot type='multiple' {...sharedProps}>
        {children}
      </AccordionRoot>
    )
  }

  return (
    <AccordionRoot type='single' collapsible {...sharedProps}>
      {children}
    </AccordionRoot>
  )
}
