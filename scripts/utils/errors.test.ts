import { describe, expect, it, vi } from 'vitest';

import { BuildError, getErrorMessage, resolveAll, throwIfErrors } from './errors';

describe('resolveAll', () => {
  it('should resolve with the values in the same order as the tasks', async () => {
    const slow = new Promise<string>((resolve) => setTimeout(() => resolve('slow'), 10));

    expect(await resolveAll(slow, Promise.resolve(2))).toEqual(['slow', 2]);
  });

  it('should reject with an AggregateError summarizing how many tasks failed', async () => {
    const promise = resolveAll(
      Promise.reject(new Error('first')),
      Promise.resolve(1),
      Promise.reject(new Error('second')),
    );

    await expect(promise).rejects.toThrow('2 of 3 task(s) failed');
  });

  it('should keep every failure reason inside the AggregateError', async () => {
    const first = new Error('first');
    const second = new Error('second');
    const promise = resolveAll(Promise.reject(first), Promise.reject(second));

    await expect(promise).rejects.toMatchObject({ errors: [first, second] });
  });

  it('should wait for every task before rejecting', async () => {
    const finished = vi.fn();
    const slow = new Promise<void>((resolve) =>
      setTimeout(() => {
        finished();
        resolve();
      }, 10),
    );

    await expect(resolveAll(Promise.reject(new Error('boom')), slow)).rejects.toThrow();
    expect(finished).toHaveBeenCalledOnce();
  });
});

describe('throwIfErrors', () => {
  it('should do nothing when there are no errors', () => {
    expect(throwIfErrors('posts', [])).toBeUndefined();
  });

  it('should throw a BuildError when there is at least one error', () => {
    expect(() => throwIfErrors('posts', ['broken'])).toThrow(BuildError);
  });

  it('should include the context, the count and every message in the error', () => {
    expect(() => throwIfErrors('posts', ['one', 'two'])).toThrow(
      '[posts] 2 error(s) found:\n\none\ntwo',
    );
  });
});

describe('getErrorMessage', () => {
  it('should return the message of an Error', () => {
    expect(getErrorMessage(new Error('boom'))).toBe('boom');
  });

  it('should stringify values that are not an Error', () => {
    expect(getErrorMessage('oops')).toBe('oops');
  });
});
