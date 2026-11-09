import { Base } from '../types';

const DIGITS_BY_BASE: Record<Base, ReadonlySet<string>> = {
  bin: new Set('01'),
  oct: new Set('01234567'),
  dec: new Set('0123456789'),
  hex: new Set('0123456789abcdef'),
};

export const createDigitValidator =
  (base: Base) =>
  (char: string): boolean => {
    const allowed = DIGITS_BY_BASE[base];
    if (allowed === undefined) return false;
    return allowed.has(char.toLowerCase());
  };

export const isValidGuess = (guess: string, length: number, base: Base): boolean => {
  const isValidChar = createDigitValidator(base);
  const hasValidLength = guess.length === length;
  const hasOnlyAllowedChars = [...guess].every(isValidChar);
  const hasUniqueChars = new Set([...guess].map((c) => c.toLowerCase())).size === guess.length;
  return hasValidLength && hasOnlyAllowedChars && hasUniqueChars;
};
