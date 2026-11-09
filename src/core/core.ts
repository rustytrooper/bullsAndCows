// const DIGITS_BY_BASE: Record<string, string> = {
//   'bin': '01',
//   'oct': '01234567',
//   'dec': '0123456789',
//   'hex' : '0123456789abcdef',
// };

import { Base } from '../types';

// export const createDigitValidator =
//   (base: string) =>
//   (char: string): boolean => {
//     const allowed = DIGITS_BY_BASE[base];
//     return allowed !== undefined && allowed.includes(char.toLowerCase());
//   };
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
