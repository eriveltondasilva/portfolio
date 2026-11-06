import { HashIcon } from 'lucide-react';
import Link from 'next/link';
import { clsx } from 'cn';

import { Icon } from '@/components/icon';
import { Badge } from '@/components/ui/badge';
import { hasTagPage } from '@/lib/blog/tags';

interface TagProps {
  tag: string;
  isLinkable: boolean;
}

function Tag({ tag, isLinkable }: TagProps) {
  return (
    <Badge
      variant='outline'
      className={clsx(
        'gap-0 bg-zinc-100 px-2.5 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
        isLinkable &&
          'transition-colors hover:bg-blue-50 hover:font-medium hover:text-blue-700 dark:hover:bg-blue-900/30 dark:hover:text-blue-300',
      )}
    >
      <Icon iconNode={HashIcon} />
      {tag}
    </Badge>
  );
}

interface TagLinkProps {
  tag: string;
}

export function TagLink({ tag }: TagLinkProps) {
  const isLinkable = hasTagPage(tag);

  if (!isLinkable) {
    return <Tag tag={tag} isLinkable={isLinkable} />;
  }

  return (
    <Link href={`/tags/${tag}`} className='rounded-full'>
      <Tag tag={tag} isLinkable={isLinkable} />
    </Link>
  );
}
