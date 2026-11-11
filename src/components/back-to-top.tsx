'use client';

import { cn } from 'cn';
import { ChevronUp } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { Icon } from './icon';

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
        onClick={scrollToTop}
        inert={!visible}
        aria-label='Voltar ao topo'
        className={cn(
          'fixed right-8 bottom-6 z-50 flex size-10 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-500 shadow-sm transition-all duration-200 hover:size-12 hover:cursor-pointer hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-700/60 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:text-zinc-100',
          visible ?
            'translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-4 opacity-0',
        )}
      >
        <Icon iconNode={ChevronUp} />
      </button>
    </>
  );
}