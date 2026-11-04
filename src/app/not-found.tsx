import { FileQuestion } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Página não encontrada',
};

export default function NotFound() {
  return (
    <main className='flex min-h-[60vh] items-center justify-center'>
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant='icon'>
            <FileQuestion />
          </EmptyMedia>

          <EmptyTitle role='heading' aria-level={1}>
            Página não encontrada
          </EmptyTitle>

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
    </main>
  );
}
