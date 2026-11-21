import { describe, expect, it } from 'vitest';

import { renderTemplate, yamlList, yamlString } from './template';

describe('renderTemplate', () => {
  it('should replace placeholders with their values', () => {
    expect(renderTemplate('title: {{title}}', { title: 'Hello' })).toBe('title: Hello\n');
  });

  it('should drop the whole line when a placeholder value is undefined', () => {
    const template = 'slug: {{slug}}\nseries: {{series}}\norder: {{order}}';
    const values = { slug: 'a', series: undefined, order: undefined };

    expect(renderTemplate(template, values)).toBe('slug: a\n');
  });

  it('should drop a line when any of its placeholders is undefined', () => {
    const template = 'pair: {{first}} {{second}}\nkept: {{first}}';

    expect(renderTemplate(template, { first: 'a', second: undefined })).toBe('kept: a\n');
  });

  it('should keep a line whose value is an empty string', () => {
    expect(renderTemplate('key: {{value}}\nother: 1', { value: '' })).toBe('key: \nother: 1\n');
  });

  it('should throw when the template uses a key that is absent from the values', () => {
    expect(() => renderTemplate('a: {{missing}}', {})).toThrow('{{missing}}');
  });

  it('should accept a known key whose value is undefined', () => {
    expect(renderTemplate('a: {{x}}\nb: 1', { x: undefined })).toBe('b: 1\n');
  });

  it('should end with exactly one trailing newline', () => {
    expect(renderTemplate('a: 1\n\n\n', {})).toBe('a: 1\n');
  });
});

describe('yamlString', () => {
  it('should wrap the value in double quotes', () => {
    expect(yamlString('hello')).toBe('"hello"');
  });

  it('should escape quotes and line breaks', () => {
    expect(yamlString('say "hi"\nnow')).toBe('"say \\"hi\\"\\nnow"');
  });
});

describe('yamlList', () => {
  it('should format items as an inline list of quoted strings', () => {
    expect(yamlList(['react', 'next js'])).toBe('["react", "next js"]');
  });

  it('should format an empty list', () => {
    expect(yamlList([])).toBe('[]');
  });
});
