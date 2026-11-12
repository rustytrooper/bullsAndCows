import { Base } from './types.js';

export type Record = {
  length: number;
  base: Base;
  attempts: number;
  timeMs: number;
  date: string;
};

const STORAGE_KEY = 'bulls-and-cows:records';
const TOP_N = 10;

export const sortRecords = (records: Record[]): Record[] =>
  [...records].sort((a, b) => a.attempts - b.attempts || a.timeMs - b.timeMs);

export const trimTopN = (records: Record[], n: number = TOP_N): Record[] =>
  sortRecords(records).slice(0, n);

export const addRecord = (records: Record[], record: Record): Record[] =>
  trimTopN([...records, record]);

export const serializeRecords = (records: Record[]): string => JSON.stringify(records);

export const deserializeRecords = (raw: string | null): Record[] => {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Record[]) : [];
  } catch {
    return [];
  }
};

export const loadRecords = (): Record[] => deserializeRecords(localStorage.getItem(STORAGE_KEY));

export const saveRecord = (record: Record): void => {
  const updatedRecords = addRecord(loadRecords(), record);
  localStorage.setItem(STORAGE_KEY, serializeRecords(updatedRecords));
};
