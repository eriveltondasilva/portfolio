import { LOCALE } from '@/lib/constants';

import type { Author } from '@/types';

const DEFAULT_DATE_OPTIONS = {
  dateStyle: 'medium',
  timeZone: 'UTC',
} satisfies Intl.DateTimeFormatOptions;

// Intl objects are expensive to build, so each distinct configuration is created once.
const dateFormatters = new Map<string, Intl.DateTimeFormat>();

function getDateFormatter(
  options?: Intl.DateTimeFormatOptions,
): Intl.DateTimeFormat {
  const key = JSON.stringify(options ?? {});
  let formatter = dateFormatters.get(key);

  if (!formatter) {
    formatter = new Intl.DateTimeFormat(LOCALE, {
      ...DEFAULT_DATE_OPTIONS,
      ...options,
    });
    dateFormatters.set(key, formatter);
  }

  return formatter;
}

export const listFormatter = new Intl.ListFormat(LOCALE, {
  style: 'long',
  type: 'conjunction',
});

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

export function getNameInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join('')
    .toUpperCase();
}

/** Returns the URL path without leading/trailing slashes (e.g. "in/username"). */
export function getUrlPathname(url: string): string {
  return new URL(url).pathname.replace(/^\/+|\/+$/g, '');
}

export function getGitHubAvatarUrl(author: Author, size = 40): string {
  // Built from the pathname so a trailing slash in the profile URL cannot break it.
  return `https://github.com/${getUrlPathname(author.socials.github)}.png?size=${size}`;
}
