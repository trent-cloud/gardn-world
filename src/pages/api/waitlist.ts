import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const prerender = false;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const POST: APIRoute = async ({ request }) => {
  let email: string | undefined;
  try {
    const body = (await request.json()) as { email?: unknown };
    if (typeof body.email === 'string') email = body.email.trim();
  } catch {
    return json({ ok: false, error: 'Invalid request body.' }, 400);
  }

  if (!email || !EMAIL_RE.test(email)) {
    return json({ ok: false, error: 'Please enter a valid email address.' }, 400);
  }

  const apiKey = import.meta.env.RESEND_API_KEY;
  const audienceId = import.meta.env.RESEND_AUDIENCE_ID;

  if (!apiKey || !audienceId) {
    console.warn('[waitlist] Resend env vars missing; returning graceful unavailable response.');
    return json({ ok: false, error: 'Waitlist temporarily unavailable.' }, 503);
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.contacts.create({
      email,
      audienceId,
      unsubscribed: false,
    });
    if (error) {
      console.error('[waitlist] Resend error:', error);
      return json({ ok: false, error: 'Could not add you right now. Please try again.' }, 502);
    }
    return json({ ok: true });
  } catch (err) {
    console.error('[waitlist] Unexpected error:', err);
    return json({ ok: false, error: 'Could not add you right now. Please try again.' }, 500);
  }
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
