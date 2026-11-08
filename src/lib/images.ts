import type { ImageProps } from 'next/image';

/**
 * Post content width: max-w-3xl (768px) minus md:px-8 on both sides.
 * Keep in sync with the <main> in app/blog/[slug]/page.tsx.
 */
const POST_CONTENT_WIDTH = 704;

const MOBILE_MAX_WIDTH = 767; // below Tailwind's md breakpoint
const MOBILE_GUTTER_REM = 2; // px-4 on both sides
const GRID_GAP_REM = 0.75; // gap-3

export const DEFAULT_IMAGE_SIZES = `(max-width: ${MOBILE_MAX_WIDTH}px) calc(100vw - ${MOBILE_GUTTER_REM}rem), ${POST_CONTENT_WIDTH}px`;

// Blur needs a blurDataURL, which static imports of svg/gif do not have
export function getPlaceholder(src: ImageProps['src']): 'blur' | 'empty' {
  return typeof src === 'object' && 'blurDataURL' in src && src.blurDataURL ?
      'blur'
    : 'empty';
}

/**
 * Widest grid slot: 2 columns. The 3-column grid (md+) only makes slots smaller,
 * so a single conservative value serves both.
 */
const GRID_DESKTOP_WIDTH = Math.ceil(
  (POST_CONTENT_WIDTH - GRID_GAP_REM * 16) / 2,
);

export const GRID_IMAGE_SIZES = `(max-width: ${MOBILE_MAX_WIDTH}px) calc((100vw - ${MOBILE_GUTTER_REM}rem - ${GRID_GAP_REM}rem) / 2), ${GRID_DESKTOP_WIDTH}px`;
