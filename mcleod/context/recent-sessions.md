# Recent sessions — Gardn World (marketing)

The last three session blocks, newest at the top. Read for brainstorming context — these capture the narrative that `CURRENT_SESSION.md` (the one-page handover) condenses.

Maintained by the `SESSION_END` protocol: each session-end prepends its block here and trims to the most recent three. The canonical archive path is `mcleod/docs/sessions/YYYY-MM-DD.md`.

---

## Session — 2026-05-27 — gardn-ops portal build

### What changed

- Built the entire gardn-ops operations portal from scratch — new repo at `~/Documents/gardn-ops`, deployed to Vercel. GitHub repo: `trent-cloud/gardn-ops` (private).
- 17 portal modules: Mission Control, Growth Engine, Revenue, Finance (runway + scenarios + costs + LTV + investor view), Content Command, Newsletter, Support Centre, User Intelligence, Competitive Intel, Influencer Portal, SEO Command, Seasonal Intelligence, International Launch (7 markets), Agent Control, App Health, Setup.
- 4 API routes: content generation (Claude), NL-to-SQL queries, support webhook + send.
- 12 agent system prompts (Sentinel, Guardian, Scribe, Weathervane, Lookout, Cultivator, Analyst, Concierge, Advocate, Ambassador, Curator, Orchestrator) with fleet manifest and guardrail architecture.
- Supabase portal migration ready (8 tables). Auth via magic link.
- Solicitor sign-off on Privacy v2.0 + Terms v1.0 confirmed done.
- Pricing locked: £5.99/mo or £49.99/yr, 14-day free trial.

### Current state

gardn-ops portal live on Vercel (preview URL — needs `ops.gardn.world` CNAME). 17 modules, 4 API routes, 12 agent prompts. Needs SUPABASE_SERVICE_ROLE_KEY + ANTHROPIC_API_KEY to light up. gardn-world marketing site unchanged.

### Next

Add env vars to Vercel, run portal migration SQL in Supabase, set up `ops.gardn.world` CNAME, deploy first agents (Sentinel + Guardian + Scribe).

### Promote to DECISIONS?

Yes — pricing locked at £5.99/mo or £49.99/yr with 14-day free trial.

---

## Session — 2026-05-14 — McLeod estate sync + SESSION_STATE.md retirement

### What changed

- Synced repo to the McLeod estate overhaul. New canonical `mcleod/` files. Root-level duplicates retired.
- `mcleod/context/domain.md` + `mcleod/context/architecture.md` — scaffolds replaced with real gardn-world content.
- Committed three pending local edits. Reverted in-progress privacy edit. Retired `SESSION_STATE.md`.

### Current state

gardn-world site unchanged — still live on `5d37826`. Repo fully migrated to McLeod canonical structure.

### Next

Stand up `/social-drafts/` folder and draft the first week's 5-7 social posts in Doc 15 voice.

### Promote to DECISIONS?

No.
