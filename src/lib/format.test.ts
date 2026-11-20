import { describe, expect, it } from 'vitest';

import {
  createListFormatter,
  formatDate,
  formatReadingTime,
  getGitHubAvatarUrl,
  getNameInitials,
  getUrlPathname,
} from './format';

import type { Author } from '@/types';

describe('formatDate', () => {
  it('should format an ISO date in Brazilian Portuguese', () => {
    expect(formatDate('2026-01-10', { dateStyle: 'long' })).toBe('10 de janeiro de 2026');
  });

  it('should not shift the day because of the local time zone', () => {
    expect(formatDate('2026-03-01', { dateStyle: 'long' })).toBe('1 de março de 2026');
  });

  it('should honor different options for the same date', () => {
    expect(formatDate('2026-01-10', { dateStyle: 'short' })).toBe('10/01/2026');
  });

  it('should return a fallback message for an invalid date', () => {
    expect(formatDate('not-a-date')).toBe('Data inválida');
  });
});

describe('createListFormatter', () => {
  it('should join two names with "e"', () => {
    expect(createListFormatter().format(['Ana', 'Bia'])).toBe('Ana e Bia');
  });

  it('should separate three names with commas and a final "e"', () => {
    expect(createListFormatter().format(['Ana', 'Bia', 'Caio'])).toBe('Ana, Bia e Caio');
  });
});

describe('formatReadingTime', () => {
  it('should show only minutes under one hour', () => {
    expect(formatReadingTime(45)).toBe('45 min');
  });

  it('should show only hours when minutes are zero', () => {
    expect(formatReadingTime(120)).toBe('2 h');
  });

  it('should show hours and minutes together', () => {
    expect(formatReadingTime(125)).toBe('2 h 5 min');
  });

  it('should handle zero minutes', () => {
    expect(formatReadingTime(0)).toBe('0 min');
  });
});

describe('getNameInitials', () => {
  it('should return the initials of the first two words', () => {
    expect(getNameInitials('Erivelton Silva')).toBe('ES');
  });

  it('should ignore words after the second one', () => {
    expect(getNameInitials('Ana Beatriz Costa')).toBe('AB');
  });

  it('should ignore extra whitespace and uppercase the result', () => {
    expect(getNameInitials('  ana   souza ')).toBe('AS');
  });

  it('should return one letter for a single name', () => {
    expect(getNameInitials('Ana')).toBe('A');
  });

  it('should return an empty string for an empty name', () => {
    expect(getNameInitials('')).toBe('');
  });
});

describe('getUrlPathname', () => {
  it('should return the path without the leading slash', () => {
    expect(getUrlPathname('https://github.com/erivelton')).toBe('erivelton');
  });

  it('should drop the trailing slash', () => {
    expect(getUrlPathname('https://github.com/erivelton/')).toBe('erivelton');
  });

  it('should keep inner segments', () => {
    expect(getUrlPathname('https://linkedin.com/in/erivelton/')).toBe('in/erivelton');
  });
});

describe('getGitHubAvatarUrl', () => {
  it('should build the avatar URL with the default size', () => {
    const author = { socials: { github: 'https://github.com/erivelton/' } } as Author;

    expect(getGitHubAvatarUrl(author)).toBe('https://github.com/erivelton.png?size=40');
  });

  it('should use a custom size', () => {
    const author = { socials: { github: 'https://github.com/erivelton' } } as Author;

    expect(getGitHubAvatarUrl(author, 80)).toBe('https://github.com/erivelton.png?size=80');
  });
});
