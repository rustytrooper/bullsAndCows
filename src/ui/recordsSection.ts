import type { Record } from '../records';
import { el } from './dom';

const formatTime = (timeMs: number): string => {
  const totalSeconds = Math.round(timeMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const pad = (n: number): string => String(n).padStart(2, '0');
  return `${pad(minutes)}:${pad(seconds)}`;
};

const formatDate = (iso: string): string => {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? iso : date.toLocaleDateString();
};

const recordItem = (record: Record): HTMLElement => {
  const badge = el('span', 'records__badge', `${record.base} · ${record.length}`);
  const attempts = el('span', 'records__attempts', `${record.attempts} attempts`);
  const time = el('span', 'records__time', formatTime(record.timeMs));
  const date = el('span', 'records__date', formatDate(record.date));
  return el('li', 'records__item', badge, attempts, time, date);
};

export const recordsSection = (records: Record[]): HTMLElement => {
  const title = el('h3', 'records__title', 'Top results');
  const content =
    records.length === 0
      ? el('p', 'records__empty', 'No records yet')
      : el('ul', 'records__list', ...records.map(recordItem));

  return el('section', 'records', title, content);
};
