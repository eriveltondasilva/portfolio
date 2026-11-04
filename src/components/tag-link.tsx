import { HashIcon } from 'lucide-react';
import Link from 'next/link';

import { Icon } from '@/components/icon';
import { Badge } from '@/components/ui/badge';

interface Props {
  tag: string;
}

export function TagLink({ tag }: Props) {
  return (
    <Link href={`/tags/${tag}`} className='rounded-full'>
      <Badge
        variant='outline'
        className='bg-zinc-100 px-2.5 py-0.5 text-xs text-zinc-600 transition-colors hover:bg-blue-50 hover:font-semibold hover:text-blue-700 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-blue-900/30 dark:hover:text-blue-300'
      >
        <Icon iconNode={HashIcon} />
        {tag}
      </Badge>
    </Link>
  );
}
