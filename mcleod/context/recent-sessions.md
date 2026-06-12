# Recent sessions — Gardn World (marketing)

The last three session blocks, newest at the top. Read for brainstorming context — these capture the narrative that `CURRENT_SESSION.md` (the one-page handover) condenses.

Maintained by the `SESSION_END` protocol: each session-end prepends its block here and trims to the most recent three. The canonical archive path is `mcleod/docs/sessions/YYYY-MM-DD.md`.

---

## Session — 2026-06-12 — brand audit + live fix sprint

### What changed

- **Brand audit of gardn.world against the canonical sources** (`~/gardn-native/BRAND_VOICE.md`, theme tokens, Doc 10, `PREMIUM_TIERS.md`, the ops Brand Kit). Found and fixed in 15 commits (`5c341a4`..`cea9999`), all deployed and verified live with Richard driving.
- **Logo/asset fixes (`5c341a4`):** `assets/gardn-mark.svg` was a broken pattern-fill wrapper rendering blank — replaced with the true vector from the ops brand kit, framed to match the old PNG proportions; new paper variant for the footer, whose Geoleaf mark was previously invisible (forest mark on forest-deep with no `.on-dark` class). Favicon existed nowhere (live `/favicon.ico` 404) — SVG + 96px PNG links on all pages, `/favicon.ico` rewrite, proper 180px apple-touch-icon. Header lockups now serve 1.5KB SVG instead of a 423KB PNG.
- **CSP was blocking Google Fonts** — `style-src`/`font-src` lacked the fonts hosts, so **Figtree never loaded in production**; the entire site rendered in system fallback. Fixed; brand type live for the first time.
- **`/notes/{border-scan,frost,memory}` canonical URLs were fully broken** (relative CSS/JS/img/link paths under the rewrites — same-morning regression from `3bae9ee`). All refs absolutised.
- **Copy truth sweep (`022d069`):** every "free trial" replaced with reverse-trial language per the locked pricing policy; index CTA no longer implies auto-billing; "unlocks" (banned SaaS verb) fixed on pricing; eight straight apostrophes curled. Supersedes the unmerged `fable/night-terms` branch — it can be deleted.
- **Strapline:** footer "A garden app that grows with you." → **"Grow together."** on all 15 pages. Title/og/manifest descriptors deliberately unchanged (SEO surfaces — pending a call).
- **Hero sub-line rewritten place-first** (`a8029d4`): leads with the mapped, geo-located garden (beds/borders/pots, postcode, soil, frosts) per Doc 10's anti-feature-list rule. Richard picked from three drafts. Old Doc-15-era "sub-line locked" note superseded by founder request.
- **Trust strip:** community cell warmed to "The gardeners on your road." (`a73c252`); "Built for UK gardens…" line removed from index + features (`299e284`).
- **Border Scan copy** redrafted by Richard on home (`020c437`), features aligned (`ca61e5a`): "multiple sources", confidence-level hedging dropped. "Catastrophising" → "alarmist" both health-check passages (`cea9999`).
- **Nav:** active-page underline rebuilt as an absolute hairline — text no longer lifts on the current page (`20c8035`); header Geoleaf mark +50% to 39px (`1930683`). Hero sub-line de-italicised (`7c02b7b`).
- **Border Scan visual:** CSS skeleton mock → real en-GB Garden spaces capture, 560w (`5a35a60`, after a first pass with the Home screen `20c8035`).
- **Footer social row added** (`7f28de8` + `deb8830`): Instagram **@gardn.world** (differs from the rest), Facebook/X/TikTok **@gardnworld**. CLAUDE.md corrected; saved to auto-memory.
- **Security (`e8a49a0`):** gardn.world was publicly serving `CLAUDE.md`, `mcleod/` (session notes, business state) and `docs/` — all 200. `.vercelignore` now excludes them; verified 404 post-deploy. **The GitHub repo itself is still PUBLIC** — same files readable there; flagged to Richard, unresolved (needs Trent/`gh repo edit --visibility private`).
- Stale-doc findings: Doc 15 (site-copy source of truth) no longer exists anywhere; root CLAUDE.md + `mcleod/context/architecture.md` described the retired Astro stack (architecture.md rewritten this session); CLAUDE.md brand-source paths point at dead `~/Documents/` locations (actual: `~/gardn-native`).

### Current state

Marketing site live and materially more on-brand: real vector logo + favicon, Figtree actually loading, reverse-trial copy truth everywhere, "Grow together." strapline, place-first hero, social row, notes pages working at canonical URLs, internal docs no longer served. Open decisions: wordmark case (ops Brand Kit uppercase "GARDN" vs app token lowercase "gardn" — two canons contradict), "Inspire" vs "Inspired by Gardn" feature naming (features.html conflates them), warm token `#C4A46A` vs canonical `#7D5F15`, title/og/manifest strapline, GitHub repo visibility.

### Next

Flip `trent-cloud/gardn-world` to private (needs Trent's nod), then rule on the wordmark case and Inspire naming.

### Promote to DECISIONS?

Yes — **social handles: Instagram @gardn.world; Facebook / X / TikTok @gardnworld** (Instagram deliberately differs; recorded in CLAUDE.md, confirmed by Richard 2026-06-12).

---

## Session — 2026-05-27 — gardn-ops portal build

### What changed

- Built the entire gardn-ops operations portal from scratch — new repo at `~/Documents/gardn-ops`, deployed to Vercel. GitHub repo: `trent-cloud/gardn-ops` (private).
- 17 portal modules: Mission Control, Growth Engine, Revenue, Finance (runway + scenarios + costs + LTV + investor view), Content Command, Newsletter, Support Centre, User Intelligence, Competitive Intel, Influencer Portal, SEO Command, Seasonal Intelligence, International Launch (7 markets), Agent Control, App Health, Setup.
- 4 API routes: content generation (Claude), NL-to-SQL queries, support webhook + send.
- 12 agent system prompts (Sentinel, Guardian, Scribe, Weathervane, Lookout, Cultivator, Analyst, Concierge, Advocate, Ambassador, Curator, Orchestrator) with fleet manifest and guardrail architecture.
- Supabase portal migration ready (8 tables). Auth via magic link.
- Solicitor sign-off on Privacy v2.0 + Terms v1.0 confirmed done.
- Pricing superseded on 2026-06-09: £6.99/mo or £49.99/yr, 7-day free trial.

### Current state

gardn-ops portal live on Vercel (preview URL — needs `ops.gardn.world` CNAME). 17 modules, 4 API routes, 12 agent prompts. Needs SUPABASE_SERVICE_ROLE_KEY + ANTHROPIC_API_KEY to light up. gardn-world marketing site unchanged.

### Next

Add env vars to Vercel, run portal migration SQL in Supabase, set up `ops.gardn.world` CNAME, deploy first agents (Sentinel + Guardian + Scribe).

### Promote to DECISIONS?

Yes — pricing superseded on 2026-06-09 to £6.99/mo or £49.99/yr with 7-day free trial.

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
