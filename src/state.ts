import { evaluateGuess } from './core/core.js';
import { Attempt, Base } from './types.js';

export type Settings = { length: number; base: Base };
export type Status = 'playing' | 'won';

export type GameState = {
  settings: Settings;
  secret: string;
  history: Attempt[];
  status: Status;
  startedAt: number;
  finishedAt?: number;
};

export type AppState =
  { screen: 'settings' } | { screen: 'game'; game: GameState; inputError: string | null };

export const createGameState = (
  settings: Settings,
  secret: string,
  startedAt: number
): GameState => ({
  settings,
  secret,
  history: [],
  status: 'playing',
  startedAt,
});

export const isWon = (state: GameState): boolean => state.status === 'won';

export const isDuplicateGuess = (state: GameState, guess: string): boolean =>
  state.history.some((a) => a.guess === guess);

export const applyGuess = (state: GameState, guess: string, now: number): GameState => {
  if (isWon(state)) return state;
  const { bulls, cows } = evaluateGuess(state.secret, guess);
  const entry: Attempt = { guess, bulls, cows };
  const win = bulls === state.settings.length;
  return {
    ...state,
    history: [...state.history, entry],
    status: win ? 'won' : 'playing',
    finishedAt: win ? now : undefined,
  };
};
