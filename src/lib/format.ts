import { LOCALE } from '@/lib/constants';

import type { Author } from '@/types';

// ─────────────────────────────────────

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

// ─────────────────────────────────────

export function createListFormatter() {
  return new Intl.ListFormat(LOCALE, {
    style: 'long',
    type: 'conjunction',
  });
}

// ─────────────────────────────────────

const MINUTES_IN_AN_HOUR = 60;

export function formatReadingTime(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / MINUTES_IN_AN_HOUR);
  const minutes = totalMinutes % MINUTES_IN_AN_HOUR;

  if (hours === 0) return `${minutes} min`;
  if (minutes === 0) return `${hours} h`;

  return `${hours} h ${minutes} min`;
}

// ─────────────────────────────────────

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
