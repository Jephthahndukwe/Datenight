import type { Choice } from '../config/site';

const KEY = 'dinner:answer';

export function loadAnswer(): Choice | null {
  try {
    if (new URLSearchParams(location.search).has('reset')) {
      localStorage.removeItem(KEY);
      return null;
    }
    const v = localStorage.getItem(KEY);
    return v === 'yes' || v === 'obviously' ? v : null;
  } catch {
    return null;
  }
}

export function saveAnswer(c: Choice) {
  try {
    localStorage.setItem(KEY, c);
  } catch {
    /* private mode etc. */
  }
}
