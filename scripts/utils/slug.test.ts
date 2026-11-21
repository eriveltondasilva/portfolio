import { describe, expect, it } from 'vitest';

import { slugify } from './slug';

describe('slugify', () => {
  it('should lowercase the text and remove accents', () => {
    expect(slugify('Ação Rápida')).toBe('acao-rapida');
  });

  it('should collapse runs of symbols and spaces into a single hyphen', () => {
    expect(slugify('React & Next.js: o guia')).toBe('react-next-js-o-guia');
  });

  it('should trim hyphens produced at both ends', () => {
    expect(slugify('¿Por quê?')).toBe('por-que');
  });

  it('should cut at 120 characters without leaving a trailing hyphen', () => {
    expect(slugify(`${'a'.repeat(119)} b`)).toBe('a'.repeat(119));
  });

  it('should return an empty string when there is nothing alphanumeric', () => {
    expect(slugify('!!!')).toBe('');
  });
});
