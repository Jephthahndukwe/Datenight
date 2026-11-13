/**
 * Vercel serverless function: emails you the moment she answers.
 *
 * Env vars (Vercel > Project > Settings > Environment Variables):
 *   RESEND_API_KEY      required. If missing, the function does nothing (returns 204).
 *   NOTIFY_TO_EMAIL     required. Where the email goes.
 *   NOTIFY_FROM_EMAIL   optional. Defaults to Resend's sandbox sender "onboarding@resend.dev"
 *                       (which can only deliver to the email you signed up to Resend with).
 *
 * To turn the feature off: set `notify.enabled: false` in src/config/site.ts
 * (the page then never calls this endpoint), or just don't set the env vars.
 */

const LABEL: Record<string, string> = {
  yes: '“Yes”',
  obviously: '“Obviously yes”',
};

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });

export async function POST(request: Request): Promise<Response> {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFY_TO_EMAIL;
  if (!key || !to) return new Response(null, { status: 204 });

  // cheap abuse guard: browsers always send Origin on a cross-site POST, so reject foreign origins
  const origin = request.headers.get('origin');
  if (origin && new URL(origin).host !== new URL(request.url).host) return json(403, { error: 'forbidden' });

  let body: { choice?: string; her?: string; at?: string } = {};
  try {
    body = await request.json();
  } catch {
    return json(400, { error: 'bad json' });
  }
  const choice = body.choice === 'yes' || body.choice === 'obviously' ? body.choice : null;
  if (!choice) return json(400, { error: 'bad choice' });

  const her = String(body.her ?? 'She').slice(0, 60).replace(/[<>&"]/g, '');
  const when = new Date().toUTCString();
  const from = process.env.NOTIFY_FROM_EMAIL || 'Dinner for Two <onboarding@resend.dev>';

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      from,
      to: [to],
      subject: `${her} said yes 🕯️`,
      html: `<div style="font-family:Georgia,serif;font-size:18px;line-height:1.5;color:#2c0b19">
        <p><strong>${her}</strong> just tapped ${LABEL[choice]}.</p>
        <p style="color:#7b2140">Time to pick something to wear.</p>
        <p style="font-size:13px;color:#888">${when}</p></div>`,
    }),
  });

  if (!res.ok) return json(502, { error: 'resend failed', status: res.status });
  return json(200, { ok: true });
}

// Anything but POST is a 405
export function GET() {
  return new Response('Method Not Allowed', { status: 405, headers: { allow: 'POST' } });
}
