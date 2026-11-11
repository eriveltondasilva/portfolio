import { FilePenIcon } from 'lucide-react';

import { Icon } from '@/components/icon';
import { PostReactions } from '@/components/post-reactions';
import { Button } from '@/components/ui/button';

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
        <a href={editUrl} target='_blank' rel='noopener noreferrer'>
          <Icon iconNode={FilePenIcon} />
          Sugerir edição
        </a>
      </Button>
    </footer>
  );
}
