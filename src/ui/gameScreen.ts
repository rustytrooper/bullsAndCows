import { createDigitValidator } from '../core/core.js';
import { Record } from '../records.js';
import { GameState } from '../state.js';
import { Attempt } from '../types.js';
import { el, setAttrs } from './dom.js';
import { formatTime } from './format.js';
import { recordsSection } from './recordsSection.js';
import { isWon as isGameWon } from '../state.js';

type GameHandlers = {
  onGuess: (guess: string) => void;
  onNewGame: () => void;
};

const historyItem = (attempt: Attempt): HTMLElement =>
  el(
    'li',
    'game-screen__history-item',
    el('span', 'game-screen__guess', attempt.guess),
    el('span', 'game-screen__bull', `${attempt.bulls} bulls`),
    el('span', 'game-screen__cow', `${attempt.cows} cows`)
  );

const buildForm = (game: GameState, handlers: GameHandlers): HTMLElement => {
  const { length, base } = game.settings;
  const isValidChar = createDigitValidator(base);

  const input = setAttrs(el('input', 'game-screen__input'), {
    type: 'text',
    maxLength: length,
    autocomplete: 'off',
    inputMode: 'text',
  });
  input.addEventListener('input', () => {
    input.value = [...input.value].filter(isValidChar).join('');
  });

  const checkButton = setAttrs(el('button', 'game-screen__button', 'Check'), {
    type: 'button',
  });
  checkButton.addEventListener('click', () => handlers.onGuess(input.value));

  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') handlers.onGuess(input.value);
  });

  return el('div', 'game-screen__form', input, checkButton);
};

const buildWinBlock = (game: GameState): HTMLElement => {
  const attempts = game.history.length;
  const timeMs = (game.finishedAt ?? game.startedAt) - game.startedAt;
  return el(
    'div',
    'game-screen__win',
    el('h2', 'game-screen__win-title', 'You won!'),
    el('p', 'game-screen__win-attempts', `Attempts: ${attempts}`),
    el('p', 'game-screen__win-time', `Time: ${formatTime(timeMs)}`)
  );
};

export const gameScreen = (
  game: GameState,
  inputError: string | null,
  records: Record[],
  handlers: GameHandlers
): HTMLElement => {
  const { length, base } = game.settings;
  const won = isGameWon(game);

  const newGameButton = setAttrs(el('button', 'game-screen__button--new', 'New game'), {
    type: 'button',
  });
  newGameButton.addEventListener('click', handlers.onNewGame);

  const header = el(
    'header',
    'game-screen__header',
    el('span', 'game-screen__settings-badge', `${base} · ${length}`),
    newGameButton
  );

  const form = won ? '' : buildForm(game, handlers);
  const errorBlock = inputError ? el('p', 'game-screen__error', inputError) : '';
  const historyBlock = el(
    'ul',
    'game-screen__history',
    ...[...game.history].reverse().map(historyItem)
  );
  const winBlock = won ? buildWinBlock(game) : '';

  return el(
    'section',
    'game-screen',
    header,
    form,
    errorBlock,
    historyBlock,
    winBlock,
    recordsSection(records)
  );
};
