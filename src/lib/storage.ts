import type { Choice, Picks } from '../config/site';

const KEY = 'dinner:state';

export type Saved = { answer: Choice | null; picks: Picks };

export function loadState(): Saved {
  const empty: Saved = { answer: null, picks: {} };
  try {
    if (new URLSearchParams(location.search).has('reset')) {
      localStorage.removeItem(KEY);
      return empty;
    }
    const raw = localStorage.getItem(KEY);
    if (!raw) return empty;
    const v = JSON.parse(raw) as Partial<Saved>;
    return {
      answer: v.answer === 'yes' || v.answer === 'obviously' ? v.answer : null,
      picks: v.picks && typeof v.picks === 'object' ? v.picks : {},
    };
  } catch {
    return empty;
  }
}

export function saveState(s: Saved) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* private mode etc. */
  }
}
