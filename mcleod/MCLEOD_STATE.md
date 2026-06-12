# MCLEOD_STATE.md

Update this file at the end of every session. The McLeod hub does NOT read this file (since 2026-05-16 it reads `project_state.project_updates` directly via Supabase; `summarise-project-state` writes that row daily at 02:00 UTC from main-branch commits). This file is the Claude.ai canonical-state surface read by per-project syncs.

---

<!-- updated: 2026-06-12 -->

## Current state

Site live after a full imagery sprint (2026-06-12 PM, Richard driving): map-first home screenshot narrative from the iOS launch set, real photos or designed mocks in every phone frame (health check, wildlife, bird listen, border-scan-onto-plan), Maya lifestyle photo behind the features fold, Inspired before/after rebuilt as the same photograph of Richard's own border (sparse real frame → enhanced same-frame variation), founders photo on story, bloom sprig divider removed site-wide. Full site review run: voice/links/SEO/headers clean; open findings — pricing.html og:image points at a non-existent /og.png (HIGH), home page carries ~5.2MB of assets (WebP pass owed), photo-hands.jpg unused, delete-account headings missing full stops. Stale-docs fix applied: waitlist endpoint is `/api/subscribe` (docs said `/api/waitlist`). Wordmark-case "contradiction" dissolved — uppercase GARDN everywhere, the app token was a red herring. Cross-repo flag: gardn-native locales direct support mail to support@gardn.app, a third-party domain — must fix before launch. PR #1 (canon CI check) still open; repo still public; title/og/manifest strapline call still pending.

## Next

Fix pricing.html og:image (non-existent /og.png), then resolve PR #1 (cherry-pick canon CI, close superseded copy half).
