import { countPossibleSecrets } from '../src/core/core';
import { describe, it, expect } from 'vitest';

describe('countPossibleSecrets', () => {
  it('bin length 2 → 2', () => {
    expect(countPossibleSecrets(2, 'bin')).toBe(2);
  });

  it('oct length 2 → 56 (8*7)', () => {
    expect(countPossibleSecrets(2, 'oct')).toBe(56);
  });

  it('dec length 1 → 10', () => {
    expect(countPossibleSecrets(1, 'dec')).toBe(10);
  });

  it('dec length 4 → 5040 (10*9*8*7)', () => {
    expect(countPossibleSecrets(4, 'dec')).toBe(5040);
  });

  it('hex length 6 → 5765760', () => {
    expect(countPossibleSecrets(6, 'hex')).toBe(5765760);
  });

  it('returns 0 when length exceeds available digits', () => {
    expect(countPossibleSecrets(3, 'bin')).toBe(0);
    expect(countPossibleSecrets(9, 'oct')).toBe(0);
  });

  it('is memoized: repeated calls return same result (observable)', () => {
    const a = countPossibleSecrets(5, 'hex');
    const b = countPossibleSecrets(5, 'hex');
    expect(a).toBe(b);
  });
});
