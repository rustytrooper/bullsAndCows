import { describe, it, expect } from 'vitest';
import { generateSecret } from '../src/core/core';

describe('generateSecret', () => {
  describe('length and uniqueness', () => {
    it('returns a string of the requested length', () => {
      expect(generateSecret(4, 'dec', () => 0.5)).toHaveLength(4);
      expect(generateSecret(2, 'bin', () => 0.5)).toHaveLength(2);
      expect(generateSecret(6, 'hex', () => 0.5)).toHaveLength(6);
    });

    it('returns unique digits', () => {
      const secret = generateSecret(6, 'hex', () => 0.5);
      expect(new Set(secret).size).toBe(secret.length);
    });

    it('uses only allowed characters for the base', () => {
      const secret = generateSecret(6, 'oct', () => 0.5);
      [...secret].forEach((c) => expect('01234567').toContain(c));
    });
  });

  describe('determinism via injected random', () => {
    it('returns same result for same deterministic random', () => {
      const fixed = () => 0;
      expect(generateSecret(4, 'dec', fixed)).toBe(generateSecret(4, 'dec', fixed));
    });

    it('picks first available digits when random is 0', () => {
      expect(generateSecret(4, 'dec', () => 0)).toBe('0123');
      expect(generateSecret(2, 'bin', () => 0)).toBe('01');
    });

    it('picks last available digits when random approaches 1', () => {
      expect(generateSecret(2, 'dec', () => 0.999999)).toBe('98');
    });

    it('respects random values in the middle of the range', () => {
      // Math.floor(0.5 * 10) = 5 → берём '5', затем из оставшихся 9
      // Math.floor(0.5 * 9) = 4 → берём '4' (в '012346789' индекс 4 = '4')
      const secret = generateSecret(2, 'dec', () => 0.5);
      expect(secret).toBe('54');
    });
  });

  describe('leading zeros', () => {
    it('preserves leading zero as a string', () => {
      const secret = generateSecret(3, 'dec', () => 0);
      expect(secret).toBe('012');
      expect(secret[0]).toBe('0');
      expect(typeof secret).toBe('string');
    });
  });

  describe('hex lowercase', () => {
    it('returns lowercase letters for hex', () => {
      const secret = generateSecret(6, 'hex', () => 0.5);
      expect(secret).toMatch(/^[0-9a-f]{6}$/);
    });
  });

  describe('invalid length', () => {
    it('returns empty string when length exceeds available digits', () => {
      expect(generateSecret(3, 'bin', () => 0.5)).toBe('');
      expect(generateSecret(9, 'oct', () => 0.5)).toBe('');
    });

    it('returns empty string for length 0', () => {
      expect(generateSecret(0, 'dec', () => 0.5)).toBe('');
    });
  });
});
