import { isValidGuess } from '../src/core/core';
import { describe, it, expect } from 'vitest';

describe('isValidGuess', () => {
  describe('length check', () => {
    it('returns false when guess is shorter than length', () => {
      expect(isValidGuess('12', 3, 'dec')).toBe(false);
    });
    it('returns false when guess is longer than length', () => {
      expect(isValidGuess('1234', 3, 'dec')).toBe(false);
    });
    it('returns true when length matches', () => {
      expect(isValidGuess('123', 3, 'dec')).toBe(true);
    });
  });

  describe('allowed characters check', () => {
    it('rejects chars not allowed in bin', () => {
      expect(isValidGuess('12', 2, 'bin')).toBe(false);
      expect(isValidGuess('10', 2, 'bin')).toBe(true);
    });
    it('rejects letters in dec', () => {
      expect(isValidGuess('1a3', 3, 'dec')).toBe(false);
    });
    it('accepts uppercase hex A-F', () => {
      expect(isValidGuess('AB', 2, 'hex')).toBe(true);
      expect(isValidGuess('aB', 2, 'hex')).toBe(true);
    });
    it('rejects g in hex', () => {
      expect(isValidGuess('1g', 2, 'hex')).toBe(false);
    });
  });

  describe('unique digits check', () => {
    it('rejects repeated digits', () => {
      expect(isValidGuess('112', 3, 'dec')).toBe(false);
      expect(isValidGuess('11', 2, 'dec')).toBe(false);
    });
    it('accepts all-unique digits', () => {
      expect(isValidGuess('123', 3, 'dec')).toBe(true);
    });
  });

  describe('combined conditions', () => {
    it('returns true only when all conditions hold', () => {
      expect(isValidGuess('1234', 4, 'dec')).toBe(true);
      expect(isValidGuess('123', 4, 'dec')).toBe(false);
      expect(isValidGuess('1233', 4, 'dec')).toBe(false);
      expect(isValidGuess('12a4', 4, 'dec')).toBe(false);
    });
  });

  describe('hex case-insensitivity in uniqueness', () => {
    it('treats a and A as the same digit for uniqueness', () => {
      expect(isValidGuess('aA', 2, 'hex')).toBe(false);
    });
  });
});
