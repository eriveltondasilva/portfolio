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
import { LOCALE } from '@/lib/constants';

import './globals.css';

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: Props) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang={LOCALE}>
      <body className='font-sans antialiased'>
        <main className='flex min-h-dvh items-center justify-center'>
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
      </body>
    </html>
  );
}
