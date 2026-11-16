export { cn } from 'cn';

/** Marks a static Tailwind class string so ESLint and Prettier can lint and sort it. Interpolation is a type error on purpose: Tailwind can't see dynamic class names. */
export function tw(strings: TemplateStringsArray): string {
  return (strings.raw[0] ?? '').replace(/\s+/g, ' ').trim();
}
