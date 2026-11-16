import { tw } from '@/lib/tw';

/**
 * Components wrapped in "not-prose" lose the typography styles, and Tailwind's reset
 * removes paragraph spacing and list markers. Apply this to the element that holds the
 * MDX children (Callout, Step, AccordionItem, Tab) to restore them.
 */
export const PROSE_RESET_CLASSES = tw`[&_li+li]:mt-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5 [&>*+*]:mt-3`;

/** Keep scroll-mt-24 in sync with ACTIVE_OFFSET_PX in use-active-heading.ts. */
export const PROSE_CLASSES = tw`prose max-w-none prose-zinc dark:prose-invert prose-headings:scroll-mt-24 prose-hr:my-8`;
