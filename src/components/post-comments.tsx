'use client';

import Giscus from '@giscus/react';
import { MessageSquareText } from 'lucide-react';

import { Icon } from '@/components/icon';
import { Separator } from '@/components/separator';
import { GISCUS } from '@/lib/constants';

interface Props {
  slug: string;
}

export function PostComments({ slug }: Props) {
  return (
    <section aria-label='Comentários'>
      <Separator />

      <h2 className='mb-4 flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-zinc-50'>
        <Icon iconNode={MessageSquareText} className='text-orange-500' />
        Comentários
      </h2>

      <Giscus
        repo={GISCUS.repo}
        repoId={GISCUS.repoId}
        category={GISCUS.category}
        categoryId={GISCUS.categoryId}
        mapping='specific'
        term={slug}
        strict='1'
        reactionsEnabled='0'
        emitMetadata='0'
        inputPosition='top'
        lang='pt'
        loading='lazy'
      />
    </section>
  );
}
