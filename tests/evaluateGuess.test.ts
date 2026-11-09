import { describe, it, expect } from 'vitest';
import { evaluateGuess } from '../src/core/core';

describe('evaluateGuess', () => {
  it('returns all bulls when guess equals secret', () => {
    expect(evaluateGuess('1234', '1234')).toEqual({ bulls: 4, cows: 0 });
  });

  it('returns all cows when digits are permuted', () => {
    expect(evaluateGuess('1234', '4321')).toEqual({ bulls: 0, cows: 4 });
  });

  it('counts bulls and cows correctly', () => {
    expect(evaluateGuess('1234', '1324')).toEqual({ bulls: 2, cows: 2 });
  });

  it('returns 0/0 when nothing matches', () => {
    expect(evaluateGuess('1234', '5678')).toEqual({ bulls: 0, cows: 0 });
  });

  it('counts a digit as bull, not as cow, when on its place', () => {
    expect(evaluateGuess('12', '12')).toEqual({ bulls: 2, cows: 0 });
    expect(evaluateGuess('12', '21')).toEqual({ bulls: 0, cows: 2 });
  });

  it('handles hex case-insensitively', () => {
    expect(evaluateGuess('abcd', 'ABCD')).toEqual({ bulls: 4, cows: 0 });
    expect(evaluateGuess('abcd', 'abdc')).toEqual({ bulls: 2, cows: 2 });
    expect(evaluateGuess('abcdef', 'ABCDEF')).toEqual({ bulls: 6, cows: 0 });
  });

  it('does not count the same position twice (bull not counted as cow)', () => {
    expect(evaluateGuess('0123', '3012')).toEqual({ bulls: 0, cows: 4 });
  });

  it('handles leading zeros', () => {
    expect(evaluateGuess('0123', '0123')).toEqual({ bulls: 4, cows: 0 });
  });
});
