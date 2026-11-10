import { Base, BullsCows } from '../types';

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

export const evaluateGuess = (secret: string, guess: string): BullsCows => {
  const secretChars = [...secret.toLowerCase()];
  const guessChars = [...guess.toLowerCase()];

  const bulls = guessChars.filter((c, i) => c === secretChars[i]);

  const remainingGuess = guessChars.filter((c, i) => c !== secretChars[i]);
  const remainingSecret = secretChars.filter((c, i) => c !== guessChars[i]);

  const cows = remainingGuess.filter((c) => remainingSecret.includes(c));

  return { bulls: bulls.length, cows: cows.length };
};

const cache = new Map<string, number>();
const BASE_SIZE: Record<Base, number> = { bin: 2, oct: 8, dec: 10, hex: 16 };

const countRecursive = (length: number, available: number): number => {
  if (length === 0) return 1;
  if (available < length) return 0;
  return available * countRecursive(length - 1, available - 1);
};

export const countPossibleSecrets = (length: number, base: Base): number => {
  const key = length + ':' + base;

  if (cache.has(key)) {
    return cache.get(key) as number;
  }

  const result = countRecursive(length, BASE_SIZE[base]);
  cache.set(key, result);
  return result;
};

export const generateSecret = () => {};
