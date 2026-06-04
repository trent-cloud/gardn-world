// Vercel serverless function: newsletter signup -> Resend Audiences.
// Contract (per HANDOFF): duplicate contact = success; thank-you even on Resend
// error; { ok:false } only for a genuinely invalid email. Key stays server-side.
module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'method' });
    return;
  }
  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) { body = {}; }
  }
  const email = ((body && body.email) || '').trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    res.status(200).json({ ok: false, error: 'invalid_email' });
    return;
  }

  const key = process.env.RESEND_API_KEY;
  const audience = process.env.RESEND_AUDIENCE_ID;
  if (!key || !audience) {
    console.error('subscribe: RESEND_API_KEY / RESEND_AUDIENCE_ID not set');
    res.status(200).json({ ok: true }); // never punish the visitor for our config
    return;
  }

  try {
    const r = await fetch(`https://api.resend.com/audiences/${audience}/contacts`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, unsubscribed: false }),
    });
    if (r.ok) { res.status(200).json({ ok: true }); return; }
    const txt = await r.text().catch(() => '');
    if (r.status === 409 || /exist|duplicat|already/i.test(txt)) {
      res.status(200).json({ ok: true }); // already on the list = success
      return;
    }
    console.error('subscribe: resend', r.status, txt);
    res.status(200).json({ ok: true }); // graceful thank-you even on Resend error
  } catch (e) {
    console.error('subscribe: error', e && e.message);
    res.status(200).json({ ok: true });
  }
};
