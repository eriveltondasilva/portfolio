'use client';

import Giscus from '@giscus/react';
import { MessageSquareText } from 'lucide-react';

import { GISCUS } from '@/lib/constants';

import { PostSection } from './post-section';

interface Props {
  slug: string;
}

export function PostComments({ slug }: Props) {
  return (
    <PostSection
      title='Comentários'
      icon={MessageSquareText}
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
        theme='preferred_color_scheme'
        lang='pt'
        loading='lazy'
      />
    </PostSection>
  );
}
