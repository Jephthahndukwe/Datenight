import { site, derived, type Choice } from '../config/site';

export function whatsappUrl(choice: Choice) {
  const text = site.whatsapp.messages[choice]
    .replaceAll('{her}', site.herName)
    .replaceAll('{when}', `${derived.dateLong}, ${derived.time}`)
    .replaceAll('{where}', site.restaurant.name);
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
