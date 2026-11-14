import { site } from '../config/site';

const KEY = 'dinner:state:v5';
const OLD_KEYS = ['dinner:state:v4'];

/**
 * Whether she said yes recently (so a quick reload opens straight on the ticket).
 * The memory expires after `site.rememberHours`, after which the invitation starts again.
 */
export function loadAccepted(): boolean {
  try {
    OLD_KEYS.forEach((k) => localStorage.removeItem(k));
    if (new URLSearchParams(location.search).has('reset')) {
      localStorage.removeItem(KEY);
      return false;
    }
    const at = Number(localStorage.getItem(KEY));
    const fresh = Number.isFinite(at) && at > 0 && Date.now() - at < site.rememberHours * 3_600_000;
    if (!fresh) localStorage.removeItem(KEY);
    return fresh;
  } catch {
    return false;
  }
}

export function saveAccepted() {
  try {
    localStorage.setItem(KEY, String(Date.now()));
  } catch {
    /* private mode etc. */
  }
}
