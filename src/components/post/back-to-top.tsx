'use client';

import { cn } from 'cn';
import { ChevronUpIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { Icon } from '@/components/icon';

export function BackToTop() {
  const [visible, setVisible] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;

    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry?.isIntersecting),
      {
        threshold: 0,
      },
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, []);

  const scrollToTop = () => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  };

  return (
    <>
      <div
        ref={sentinelRef}
        className='pointer-events-none absolute top-0 h-96'
        aria-hidden='true'
      />

      <button
        type='button'
        onClick={scrollToTop}
        inert={!visible}
        aria-label='Voltar ao topo'
        className={cn(
          'fixed right-8 bottom-6 z-50 flex size-10 items-center justify-center rounded-full border bg-background text-muted-foreground shadow-sm transition-all duration-200 hover:scale-120 hover:cursor-pointer hover:border-zinc-300 hover:text-foreground dark:hover:border-zinc-600',
          visible ?
            'translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-4 opacity-0',
        )}
      >
        <Icon iconNode={ChevronUpIcon} />
      </button>
    </>
  );
}
