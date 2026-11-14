import Image from 'next/image';

import { DEFAULT_IMAGE_SIZES, getPlaceholder } from '@/lib/images';

interface PostCoverProps {
  folder: string;
  coverFile: string;
}

export async function PostCover({ folder, coverFile }: PostCoverProps) {
  /**
   * Limiting the pattern to cover.<ext> keeps the bundler from pulling every
   * file of the post folders (meta.yml, stray files) into the module graph.
   */
  const extension = coverFile.slice(coverFile.lastIndexOf('.') + 1);
  const { default: coverImage } = await import(
    `@/content/posts/${folder}/cover.${extension}`
  );

  return (
    <div className='relative mt-6 aspect-2/1 w-full overflow-hidden border'>
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
