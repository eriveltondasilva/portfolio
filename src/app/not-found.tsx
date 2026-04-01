import { FileQuestion } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'

export default function NotFound() {
  return (
    <div className='flex min-h-[60vh] items-center justify-center'>
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant='icon'>
            <FileQuestion />
          </EmptyMedia>
          <EmptyTitle>Página não encontrada</EmptyTitle>
          <EmptyDescription>
            O conteúdo que você procura não existe ou foi removido.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button asChild variant='outline' size='sm'>
            <Link href='/'>Voltar ao início</Link>
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  )
}
