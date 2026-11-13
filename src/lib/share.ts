import { site, fill } from '../config/site';

export function whatsappUrl() {
  return `https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent(fill(site.whatsapp.message))}`;
}

/** Fire-and-forget email ping. Safe to call when the API or env vars are missing. */
export function notifyAccepted() {
  if (!site.notify.enabled) return;
  try {
    void fetch(site.notify.endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ choice: 'yes', her: site.herName, at: new Date().toISOString() }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* ignore */
  }
}
