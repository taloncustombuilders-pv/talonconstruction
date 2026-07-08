/**
 * Cloudflare Pages Function — POST /api/lead
 *
 * Forwards lead form submissions to the webhook set in the
 * LEAD_WEBHOOK_URL environment variable (Cloudflare Pages dashboard →
 * Settings → Environment variables → Production).
 *
 * For the free Google Apps Script receiver, see:
 *   setup/google-apps-script-lead-receiver.gs
 *
 * If LEAD_WEBHOOK_URL is not set, this returns 500 and the front end
 * shows the visitor the phone/email fallback — no leads silently lost.
 */

export async function onRequestPost(context) {
  const { request, env } = context;

  let data;
  try {
    data = await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const name = (data.name || "").toString().slice(0, 200).trim();
  const email = (data.email || "").toString().slice(0, 200).trim();
  if (!name || !email) {
    return json({ error: "Name and email are required" }, 400);
  }

  const lead = {
    name,
    email,
    phone: (data.phone || "").toString().slice(0, 50),
    project: (data.project || "").toString().slice(0, 100),
    message: (data.message || "").toString().slice(0, 3000),
    page: (data.page || "").toString().slice(0, 500),
    submitted: (data.submitted || new Date().toISOString()).toString(),
  };

  if (!env.LEAD_WEBHOOK_URL) {
    return json({ error: "LEAD_WEBHOOK_URL is not configured" }, 500);
  }

  const res = await fetch(env.LEAD_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(lead),
    redirect: "follow", // Apps Script responds via a 302 redirect
  });

  if (!res.ok) return json({ error: "Webhook delivery failed" }, 502);
  return json({ ok: true });
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
