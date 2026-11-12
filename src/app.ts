import { generateSecret, isValidGuess } from './core/core.js';
import { applyGuess, createGameState, isDuplicateGuess, isWon } from './state.js';
import type { AppState, Settings } from './state.js';
import { loadRecords, saveRecord } from './records.js';
import { settingsScreen } from './ui/settingsScreen.js';
import { gameScreen } from './ui/gameScreen.js';

let state: AppState = { screen: 'settings' };

const render = (): void => {
  const records = loadRecords();

  const screen =
    state.screen === 'settings'
      ? settingsScreen(records, handlers)
      : gameScreen(state.game, state.inputError, records, handlers);

  document.body.replaceChildren(screen);

  if (state.screen === 'game' && !isWon(state.game)) {
    const input = document.querySelector<HTMLInputElement>('.game-screen__input');
    input?.focus();
  }
};

const setState = (next: AppState): void => {
  state = next;
  render();
};

const handleStart = (settings: Settings): void => {
  const secret = generateSecret(settings.length, settings.base);
  const now = Date.now();
  setState({ screen: 'game', game: createGameState(settings, secret, now), inputError: null });
};

const handleGuess = (guess: string): void => {
  if (state.screen !== 'game') return;
  const { game } = state;

  if (!isValidGuess(guess, game.settings.length, game.settings.base)) {
    setState({
      ...state,
      inputError: `Enter ${game.settings.length} unique digits for ${game.settings.base}`,
    });
    return;
  }

  if (isDuplicateGuess(game, guess)) {
    setState({ ...state, inputError: 'This guess was already tried' });
    return;
  }

  const next = applyGuess(game, guess, Date.now());
  setState({ screen: 'game', game: next, inputError: null });

  if (isWon(next)) {
    saveRecord({
      length: next.settings.length,
      base: next.settings.base,
      attempts: next.history.length,
      timeMs: (next.finishedAt ?? next.startedAt) - next.startedAt,
      date: new Date().toISOString(),
    });
  }
};

const handleNewGame = (): void => {
  setState({ screen: 'settings' });
};

const handlers = {
  onStart: handleStart,
  onGuess: handleGuess,
  onNewGame: handleNewGame,
};

export const startApp = (): void => {
  render();
};
