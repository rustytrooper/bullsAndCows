import { countPossibleSecrets, getAvailableLengths } from '../core/core.js';
import { el, setAttrs } from './dom.js';
import { recordsSection } from './recordsSection.js';
import type { Record } from '../records.js';
import type { Settings } from '../state.js';
import { Base } from '../types.js';

type SettingsHandlers = {
  onStart: (settings: Settings) => void;
};

const BASES: Base[] = ['bin', 'oct', 'dec', 'hex'];
const ALL_LENGTHS = [2, 3, 4, 5, 6];

export const settingsScreen = (records: Record[], handlers: SettingsHandlers): HTMLElement => {
  let currentBase: Base = 'bin';
  let currentLength = 2;

  const lengthSelect = setAttrs(el('select', 'settings-screen__select'), {});
  const baseSelect = setAttrs(el('select', 'settings-screen__select'), {});

  const renderLengthOptions = (base: Base, selected: number): void => {
    const available = getAvailableLengths(base);
    lengthSelect.replaceChildren(
      ...ALL_LENGTHS.map((len) => {
        const option = el('option', undefined, String(len));
        option.value = String(len);
        option.disabled = !available.includes(len);
        option.selected = len === selected;
        return option;
      })
    );
  };

  const hint = el('p', 'settings-screen__hint');

  const updateHint = (base: Base, length: number): void => {
    hint.textContent = `Possible secrets: ${countPossibleSecrets(length, base)}`;
  };

  const syncOnBaseChange = (): void => {
    const nextBase = baseSelect.value as Base;
    const available = getAvailableLengths(nextBase);
    const nextLength = available.includes(currentLength) ? currentLength : available[0];
    currentBase = nextBase;
    currentLength = nextLength;
    renderLengthOptions(nextBase, nextLength);
    updateHint(nextBase, nextLength);
  };

  const onLengthChange = (): void => {
    currentLength = Number(lengthSelect.value);
    updateHint(currentBase, currentLength);
  };

  BASES.forEach((b) => {
    const option = el('option', undefined, b);
    option.value = b;
    option.selected = b === currentBase;
    baseSelect.append(option);
  });

  renderLengthOptions(currentBase, currentLength);
  updateHint(currentBase, currentLength);

  baseSelect.addEventListener('change', syncOnBaseChange);
  lengthSelect.addEventListener('change', onLengthChange);

  const startButton = setAttrs(el('button', 'settings-screen__button', 'Start'), {
    type: 'button',
  });
  startButton.addEventListener('click', () =>
    handlers.onStart({ length: currentLength, base: currentBase })
  );

  const fieldBase = el(
    'div',
    'settings-screen__field',
    el('label', 'settings-screen__label', 'Base'),
    baseSelect
  );
  const fieldLength = el(
    'div',
    'settings-screen__field',
    el('label', 'settings-screen__label', 'Length'),
    lengthSelect
  );

  return el(
    'section',
    'settings-screen',
    el('h1', 'settings-screen__title', 'Bulls and Cows'),
    el('div', 'settings-screen__form', fieldBase, fieldLength, hint, startButton),
    recordsSection(records)
  );
};
