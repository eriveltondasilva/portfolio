'use client';

import { AlertTriangle } from 'lucide-react';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: Props) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className='flex min-h-[60vh] items-center justify-center'>
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant='icon'>
            <AlertTriangle />
          </EmptyMedia>

          <EmptyTitle role='heading' aria-level={1}>
            Algo deu errado
          </EmptyTitle>

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
    </main>
  );
}
