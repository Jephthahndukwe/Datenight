const KEY = 'dinner:state:v4';

/** Whether she has already said yes (so a return visit opens straight on the ticket). */
export function loadAccepted(): boolean {
  try {
    if (new URLSearchParams(location.search).has('reset')) {
      localStorage.removeItem(KEY);
      return false;
    }
    return localStorage.getItem(KEY) === 'yes';
  } catch {
    return false;
  }
}

export function saveAccepted() {
  try {
    localStorage.setItem(KEY, 'yes');
  } catch {
    /* private mode etc. */
  }
}
