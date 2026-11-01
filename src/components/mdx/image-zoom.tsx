'use client';

import { XIcon } from 'lucide-react';
import NextImage from 'next/image';
import { useRef, useState } from 'react';

import { Icon } from '@/components/icon';
import { getPlaceholder } from '@/lib/images';

import type { StaticImageData } from 'next/image';
import type { ReactNode } from 'react';

interface Props {
  src: StaticImageData;
  alt: string;
  children: ReactNode;
}

export function ImageZoom({ src, alt, children }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  function openZoom() {
    setIsOpen(true);
    dialogRef.current?.showModal();
  }

  function closeZoom() {
    dialogRef.current?.close();
  }

  return (
    <>
      <button
        type='button'
        onClick={openZoom}
        aria-label={alt ? `Ampliar imagem: ${alt}` : 'Ampliar imagem'}
        className='mx-auto block w-fit max-w-full cursor-zoom-in'
      >
        {children}
      </button>

      <dialog
        ref={dialogRef}
        aria-label={alt || 'Imagem ampliada'}
        onClose={() => setIsOpen(false)}
        onClick={closeZoom}
        className='m-auto max-h-none max-w-none cursor-zoom-out bg-transparent backdrop:bg-black/80 open:animate-in open:duration-200 open:fade-in-0 motion-reduce:animate-none'
      >
        {/* The large image is only requested when the dialog opens */}
        {isOpen && (
          <NextImage
            src={src}
            alt={alt}
            sizes='100vw'
            quality={90}
            placeholder={getPlaceholder(src)}
            className='h-auto max-h-[90dvh] w-auto max-w-[95vw] rounded-md object-contain'
          />
        )}

        <button
          type='button'
          onClick={closeZoom}
          aria-label='Fechar'
          className='fixed top-4 right-4 flex size-9 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80'
        >
          <Icon iconNode={XIcon} />
        </button>
      </dialog>
    </>
  );
}
