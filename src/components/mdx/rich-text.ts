import { tw } from '@/lib/utils';

/**
 * Components wrapped in "not-prose" lose the typography styles, and Tailwind's reset
 * removes paragraph spacing and list markers. Apply this to the element that holds the
 * MDX children (Callout, Step, AccordionItem, Tab) to restore them.
 */
export const RICH_TEXT_CLASSES = [
  '[&>*+*]:mt-3',
  '[&_ul]:list-disc [&_ul]:pl-5',
  '[&_ol]:list-decimal [&_ol]:pl-5',
  '[&_li+li]:mt-1',
].join(' ');

/** Keep scroll-mt-24 in sync with ACTIVE_OFFSET_PX in use-active-heading.ts. */
export const PROSE_CLASSES = tw`prose max-w-none prose-zinc dark:prose-invert prose-headings:scroll-mt-24 prose-hr:my-8`;
