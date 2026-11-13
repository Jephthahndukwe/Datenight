import type { Choice } from '../config/site';

const KEY = 'dinner:state:v3';

export type Saved = { answer: Choice | null; pickup: string | null };

export function loadState(): Saved {
  const empty: Saved = { answer: null, pickup: null };
  try {
    if (new URLSearchParams(location.search).has('reset')) {
      localStorage.removeItem(KEY);
      return empty;
    }
    const raw = localStorage.getItem(KEY);
    if (!raw) return empty;
    const v = JSON.parse(raw) as { answer?: string; pickup?: unknown };
    return {
      answer: v.answer === 'yes' || v.answer === 'obviously' ? v.answer : null,
      pickup: typeof v.pickup === 'string' && /^\d{2}:\d{2}$/.test(v.pickup) ? v.pickup : null,
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
