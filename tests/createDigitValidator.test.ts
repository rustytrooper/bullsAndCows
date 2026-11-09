import { describe, it, expect } from 'vitest';
import { createDigitValidator } from '../src/core/core';
import { Base } from '../src/types';

describe('createDigitValidator', () => {
  it('returns a function (predicate)', () => {
    expect(typeof createDigitValidator('dec')).toBe('function');
  });

  describe('bin (base 2)', () => {
    const isValid = createDigitValidator('bin');
    it('accepts 0 and 1', () => {
      expect(isValid('0')).toBe(true);
      expect(isValid('1')).toBe(true);
    });
    it('rejects other digits and letters', () => {
      expect(isValid('2')).toBe(false);
      expect(isValid('a')).toBe(false);
    });
  });

  describe('oct (base 8)', () => {
    const isValid = createDigitValidator('oct');
    it('accepts 0-7', () => {
      ['0', '1', '7'].forEach((c) => expect(isValid(c)).toBe(true));
    });
    it('rejects 8, 9 and letters', () => {
      expect(isValid('8')).toBe(false);
      expect(isValid('9')).toBe(false);
      expect(isValid('a')).toBe(false);
    });
  });

  describe('dec (base 10)', () => {
    const isValid = createDigitValidator('dec');
    it('accepts 0-9', () => {
      ['0', '5', '9'].forEach((c) => expect(isValid(c)).toBe(true));
    });
    it('rejects letters', () => {
      expect(isValid('a')).toBe(false);
      expect(isValid('A')).toBe(false);
    });
  });

  describe('hex (base 16)', () => {
    const isValid = createDigitValidator('hex');
    it('accepts 0-9 and a-f', () => {
      ['0', '9', 'a', 'f'].forEach((c) => expect(isValid(c)).toBe(true));
    });
    it('accepts uppercase A-F (case insensitive)', () => {
      ['A', 'F'].forEach((c) => expect(isValid(c)).toBe(true));
    });
    it('rejects g, G and other symbols', () => {
      expect(isValid('g')).toBe(false);
      expect(isValid('G')).toBe(false);
      expect(isValid('!')).toBe(false);
    });
  });

  it('rejects strings longer than one character', () => {
    expect(createDigitValidator('dec')('12')).toBe(false);
    expect(createDigitValidator('dec')('')).toBe(false);
  });

  it('fails closed on unknown base (predicate always false)', () => {
    const isValid = createDigitValidator('unknown' as Base);
    ['0', '1', 'a', 'A'].forEach((c) => expect(isValid(c)).toBe(false));
  });
});
