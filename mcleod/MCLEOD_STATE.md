# MCLEOD_STATE.md

Update this file at the end of every session. The McLeod hub does NOT read this file (since 2026-05-16 it reads `project_state.project_updates` directly via Supabase; `summarise-project-state` writes that row daily at 02:00 UTC from main-branch commits). This file is the Claude.ai canonical-state surface read by per-project syncs.

---

<!-- updated: 2026-05-27 -->

## Current state

gardn-ops portal is live on Vercel (preview URL — needs `ops.gardn.world` CNAME configured in GoDaddy). 17 modules, 4 API routes, 12 agent system prompts with guardrail architecture. The portal needs SUPABASE_SERVICE_ROLE_KEY and ANTHROPIC_API_KEY added to Vercel env vars to activate real data and AI features. Solicitor sign-off on Privacy v2.0 + Terms v1.0 is done (Outstanding #1 cleared). Pricing locked at £5.99/mo or £49.99/yr, 14-day free trial. gardn-world marketing site unchanged — still on `5d37826`.

## Next

Add env vars to Vercel (SUPABASE_SERVICE_ROLE_KEY, ANTHROPIC_API_KEY, RESEND_API_KEY), run the portal migration SQL in Supabase, set up `ops.gardn.world` CNAME in GoDaddy, and begin deploying agents on the Mac Mini starting with Sentinel + Guardian + Scribe.
