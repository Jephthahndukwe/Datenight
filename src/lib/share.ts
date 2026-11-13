import { site, fill, type Choice } from '../config/site';
import { orderText, type Order } from '../config/menu';

export function whatsappUrl(choice: Choice, order: Order) {
  const text = fill(site.whatsapp.messages[choice], { menu: orderText(order) || 'Chef’s choice' });
  return `https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent(text)}`;
}

/** Fire-and-forget email ping. Safe to call when the API or env vars are missing. */
export function notifyAnswer(choice: Choice, menu: string) {
  if (!site.notify.enabled) return;
  try {
    void fetch(site.notify.endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ choice, her: site.herName, menu, at: new Date().toISOString() }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* ignore */
  }
}
