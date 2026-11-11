import type { Record } from '../records';
import { el } from './dom';
import { formatDate, formatTime } from './format';

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
