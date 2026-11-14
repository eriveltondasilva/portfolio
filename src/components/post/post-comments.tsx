'use client';

import Giscus from '@giscus/react';
import { MessageSquareTextIcon } from 'lucide-react';
import { useTheme } from 'next-themes';

import { GISCUS } from '@/lib/constants';

import { PostSection } from './post-section';

interface Props {
  slug: string;
}

export function PostComments({ slug }: Props) {
  const { resolvedTheme } = useTheme();

  return (
    <PostSection
      title='Comentários'
      icon={MessageSquareTextIcon}
      iconClassName='text-orange-500'
    >
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
        theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
        lang='pt'
        loading='lazy'
      />
    </PostSection>
  );
}
