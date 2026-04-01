import {
  Accordion as AccordionRoot,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '#/components/ui/accordion'
import { cn } from '#/lib/utils'

interface AccordionItemData {
  title: string
  content: React.ReactNode
}

interface Props {
  items: AccordionItemData[]
  type?: 'single' | 'multiple'
  className?: string
}

export function Accordion({ items, type = 'single', className }: Props) {
  return (
    <AccordionRoot
      type={type as 'multiple'}
      className={cn('not-prose', className)}
    >
      {items.map((item, index) => (
        <AccordionItem key={index} value={String(index)}>
          <AccordionTrigger>{item.title}</AccordionTrigger>
          <AccordionContent>{item.content}</AccordionContent>
        </AccordionItem>
      ))}
    </AccordionRoot>
  )
}
