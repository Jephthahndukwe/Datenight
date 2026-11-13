import type { Choice } from '../config/site';
import { categories, type Order } from '../config/menu';

const KEY = 'dinner:state:v2';

export type Saved = { answer: Choice | null; order: Order };

export function loadState(): Saved {
  const empty: Saved = { answer: null, order: {} };
  try {
    if (new URLSearchParams(location.search).has('reset')) {
      localStorage.removeItem(KEY);
      return empty;
    }
    const raw = localStorage.getItem(KEY);
    if (!raw) return empty;
    const v = JSON.parse(raw) as { answer?: string; order?: Record<string, unknown> };
    const order: Order = {};
    for (const c of categories) {
      const ids = v.order?.[c.id];
      if (Array.isArray(ids)) order[c.id] = ids.filter((x): x is string => typeof x === 'string').slice(0, c.limit);
    }
    return { answer: v.answer === 'yes' || v.answer === 'obviously' ? v.answer : null, order };
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
