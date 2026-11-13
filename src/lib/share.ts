import { site, fill, type Choice } from '../config/site';

export function whatsappUrl(choice: Choice) {
  const text = fill(site.whatsapp.messages[choice]);
  return `https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent(text)}`;
}

/** Fire-and-forget email ping. Safe to call when the API or env vars are missing. */
export function notifyAnswer(choice: Choice) {
  if (!site.notify.enabled) return;
  try {
    void fetch(site.notify.endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ choice, her: site.herName, at: new Date().toISOString() }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* ignore */
  }
}
