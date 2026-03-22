'use client'

import { AlertTriangle } from 'lucide-react'
import { useEffect } from 'react'

import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className='flex min-h-[60vh] items-center justify-center'>
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant='icon'>
            <AlertTriangle />
          </EmptyMedia>
          <EmptyTitle>Algo deu errado</EmptyTitle>
          <EmptyDescription>
            Ocorreu um erro inesperado. Tente novamente.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button variant='outline' size='sm' onClick={reset}>
            Tentar novamente
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  )
}
