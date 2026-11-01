import { cn } from 'cn';
import Image from 'next/image';

import { DEFAULT_IMAGE_SIZES, getPlaceholder } from '@/lib/images';

interface Props {
  folder: string;
  coverFile: string;
  className?: string;
}

export async function PostCover({ folder, coverFile, className }: Props) {
  const { default: coverImage } = await import(
    `@/content/posts/${folder}/${coverFile}`
  );

  return (
    <div
      className={cn(
        'relative aspect-2/1 w-full overflow-hidden rounded-md border border-zinc-200 dark:border-zinc-700/60',
        className,
      )}
    >
      <Image
        src={coverImage}
        alt=''
        className='object-cover'
        sizes={DEFAULT_IMAGE_SIZES}
        placeholder={getPlaceholder(coverImage)}
        loading='eager'
        fetchPriority='high'
        fill
      />
    </div>
  );
}
