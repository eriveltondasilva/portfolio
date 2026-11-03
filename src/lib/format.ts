import { LOCALE } from '@/lib/constants';

import type { Author } from '@/types';

// ── Date Formatter ───────────────────

const DEFAULT_DATE_OPTIONS = {
  dateStyle: 'medium',
  timeZone: 'UTC',
} satisfies Intl.DateTimeFormatOptions;

const dateFormatters = new Map<string, Intl.DateTimeFormat>();

function getDateFormatter(
  options?: Intl.DateTimeFormatOptions,
): Intl.DateTimeFormat {
  const key = JSON.stringify(options ?? {});
  const callback = () =>
    new Intl.DateTimeFormat(LOCALE, { ...DEFAULT_DATE_OPTIONS, ...options });

  return dateFormatters.getOrInsertComputed(key, callback);
}

export function formatDate(
  date: string,
  options?: Intl.DateTimeFormatOptions,
): string {
  try {
    return getDateFormatter(options).format(new Date(date));
  } catch {
    return 'Data inválida';
  }
}

// ── List Formatter ───────────────────

export function createListFormatter() {
  return new Intl.ListFormat(LOCALE, {
    style: 'long',
    type: 'conjunction',
  });
}

// ── Format Functions ─────────────────

export function getNameInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join('')
    .toUpperCase();
}

export function getUrlPathname(url: string): string {
  return new URL(url).pathname.replace(/^\/+|\/+$/g, '');
}

export function getGitHubAvatarUrl(author: Author, size = 40): string {
  return `https://github.com/${getUrlPathname(author.socials.github)}.png?size=${size}`;
}
