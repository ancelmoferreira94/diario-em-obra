import { DiaryEntry } from './types';

const STORAGE_KEY = 'jpl-gomes-diarios';

export function loadDiaries(): DiaryEntry[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveDiaries(diaries: DiaryEntry[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(diaries));
}

export function saveDiary(diary: DiaryEntry): DiaryEntry[] {
  const diaries = loadDiaries();
  const index = diaries.findIndex(d => d.id === diary.id);
  if (index >= 0) {
    diaries[index] = diary;
  } else {
    diaries.push(diary);
  }
  saveDiaries(diaries);
  return diaries;
}

export function deleteDiary(id: string): DiaryEntry[] {
  const diaries = loadDiaries().filter(d => d.id !== id);
  saveDiaries(diaries);
  return diaries;
}
