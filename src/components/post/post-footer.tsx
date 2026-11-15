import { FilePenIcon } from 'lucide-react';

import { Icon } from '@/components/icon';
import { Button } from '@/components/ui/button';
import { ExternalLink } from '@/components/external-link';

import { PostReactions } from './post-reactions';

interface Props {
  slug: string;
  editUrl: string;
  isArchived?: boolean;
}

export function PostFooter({ slug, editUrl, isArchived = false }: Props) {
  return (
    <footer className='mt-6 flex flex-wrap items-center justify-between gap-x-4 gap-y-2'>
      <PostReactions slug={slug} readOnly={isArchived} />

      <Button variant='link' asChild>
        <ExternalLink href={editUrl}>
          <Icon iconNode={FilePenIcon} />
          Sugerir edição
        </ExternalLink>
      </Button>
    </footer>
  );
}
