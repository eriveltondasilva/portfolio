import { describe, expect, it, vi } from 'vitest';

import { BuildError } from './errors';
import { createAsker } from './prompts';

import type { Interface } from 'node:readline/promises';

describe('createAsker', () => {
  it('should return a valid flag value without asking the question', async () => {
    const question = vi.fn();
    const ask = createAsker<'title'>(
      { question } as unknown as Interface,
      { title: 'From flag' },
      'new-post',
    );

    const value = await ask({ name: 'title', question: 'Title', validate: () => undefined });

    expect(value).toBe('From flag');
    expect(question).not.toHaveBeenCalled();
  });

  it('should throw a BuildError naming the flag when its value is invalid', async () => {
    const ask = createAsker<'title'>(
      { question: vi.fn() } as unknown as Interface,
      { title: '' },
      'new-post',
    );

    const promise = ask({ name: 'title', question: 'Title', validate: () => 'Title is required.' });

    await expect(promise).rejects.toBeInstanceOf(BuildError);
    await expect(promise).rejects.toThrow('--title: Title is required.');
  });

  it('should trim the typed answer', async () => {
    const question = vi.fn().mockResolvedValue('  hello  ');
    const ask = createAsker<'title'>({ question } as unknown as Interface, {}, 'new-post');

    const value = await ask({ name: 'title', question: 'Title', validate: () => undefined });

    expect(value).toBe('hello');
  });

  it('should use the default value when the answer is blank', async () => {
    const question = vi.fn().mockResolvedValue('   ');
    const ask = createAsker<'slug'>({ question } as unknown as Interface, {}, 'new-post');

    const value = await ask({
      name: 'slug',
      question: 'Slug',
      defaultValue: 'fallback',
      validate: () => undefined,
    });

    expect(value).toBe('fallback');
  });

  it('should show the default value in the prompt', async () => {
    const question = vi.fn().mockResolvedValue('typed');
    const ask = createAsker<'slug'>({ question } as unknown as Interface, {}, 'new-post');

    await ask({
      name: 'slug',
      question: 'Slug',
      defaultValue: 'my-slug',
      validate: () => undefined,
    });

    expect(question).toHaveBeenCalledWith('Slug [my-slug]: ');
  });

  it('should ask again and print the error until the answer is valid', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    const question = vi.fn().mockResolvedValueOnce('bad').mockResolvedValueOnce('good');
    const ask = createAsker<'title'>({ question } as unknown as Interface, {}, 'new-post');

    const value = await ask({
      name: 'title',
      question: 'Title',
      validate: (answer) => (answer === 'good' ? undefined : 'Invalid.'),
    });

    expect(value).toBe('good');
    expect(question).toHaveBeenCalledTimes(2);
    expect(consoleError).toHaveBeenCalledWith('  ✖ Invalid.');
  });
});
