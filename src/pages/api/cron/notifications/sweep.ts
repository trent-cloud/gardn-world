// Vercel Cron forwarder → Supabase Edge Function `notifications-sweep`.
//
// Day 8g of the notifications v1 build. The forwarder is the only
// gardn-world component of the notifications pipeline; the real work
// (Tier 1/2/3 evaluation + Expo push dispatch) happens in the Supabase
// Edge Function inside gardn-native's supabase/functions/notifications-sweep.
//
// Two cron schedules will hit this endpoint (configured in vercel.json
// in a follow-up commit once 8h smoke tests pass):
//
//   ?tier=23  hourly       (0 * * * *)   — Tier 2 + Tier 3, pre-filtered
//                                          to users in their local wake-up hour
//   ?tier=1   every 3h     (0 */3 * * *) — Tier 1 weather alerts, all users
//
// Manual test (replace placeholders):
//   curl -X POST 'https://gardn.world/api/cron/notifications/sweep?tier=23&dry_run=true'
//
// Required Vercel environment variables:
//   SUPABASE_URL      — https://<project>.supabase.co (e.g.
//                       https://bukqwunkounekhntpqkr.supabase.co for the
//                       live Gardn project)
//   WEBHOOK_SECRET    — same value as in Supabase project secrets +
//                       supabase_vault for the existing notify-* edge
//                       functions

import type { APIRoute } from 'astro'

export const prerender = false

const SUPABASE_URL = import.meta.env.SUPABASE_URL
const WEBHOOK_SECRET = import.meta.env.WEBHOOK_SECRET

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })
}

async function forward(request: Request): Promise<Response> {
  if (!SUPABASE_URL || !WEBHOOK_SECRET) {
    return json(
      {
        ok: false,
        error: 'missing env vars',
        missing: {
          SUPABASE_URL: !SUPABASE_URL,
          WEBHOOK_SECRET: !WEBHOOK_SECRET,
        },
      },
      500
    )
  }

  const incoming = new URL(request.url)
  const tier = incoming.searchParams.get('tier') ?? 'all'
  const dryRun = incoming.searchParams.get('dry_run') === 'true'

  const target = new URL(`${SUPABASE_URL}/functions/v1/notifications-sweep`)
  target.searchParams.set('tier', tier)
  if (dryRun) target.searchParams.set('dry_run', 'true')

  let upstream: Response
  try {
    upstream = await fetch(target.toString(), {
      method: 'POST',
      headers: { 'X-Webhook-Secret': WEBHOOK_SECRET },
    })
  } catch (err) {
    return json(
      { ok: false, error: `forward failed: ${(err as Error).message}` },
      502
    )
  }

  // Pass the upstream response through verbatim so Vercel Cron's
  // success/failure logging reflects the real edge function status.
  const body = await upstream.text()
  return new Response(body, {
    status: upstream.status,
    headers: { 'content-type': 'application/json' },
  })
}

// Vercel Cron sends GET. We also accept POST for manual curl tests
// and parity with the upstream edge function's POST handler.
export const GET: APIRoute = ({ request }) => forward(request)
export const POST: APIRoute = ({ request }) => forward(request)
