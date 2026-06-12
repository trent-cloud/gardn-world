# Recent sessions — Gardn World (marketing)

The last three session blocks, newest at the top. Read for brainstorming context — these capture the narrative that `CURRENT_SESSION.md` (the one-page handover) condenses.

Maintained by the `SESSION_END` protocol: each session-end prepends its block here and trims to the most recent three. The canonical archive path is `mcleod/docs/sessions/YYYY-MM-DD.md`.

---

## Session — 2026-06-12 (PM) — imagery sprint + site review

### What changed

- **Home screenshot narrative restructured to map-first** (`fd19a20`): new "Every bed, border and pot, on one map." section after the trust strip (Garden map launch capture — the hero's central promise, previously never shown); "Your garden's week" now uses the launch Home-screen capture (kills an off-policy Nottingham reference); Journey uses the Memory capture ("June across the years"); Border Scan spaces capture refreshed. Sections now mirror the hero sub-line order. Ask Gardn deliberately kept the older richer capture (its reply names the dahlia in the Left Border, which is what the copy promises). aria fixes on both pages (`f864be5`).
- **All four designed phone mocks rebuilt with real imagery** (`e3fbe73` home, `69369cf` features): Health check gets a stressed-maple photo crop + real assessment/plan copy; Wildlife score is a designed mock (63/100, per-species bars) replacing the cut-off screenshot; Bird Listen gains timer, waveform, bird-silhouette chips. Nature pair grid was inline `1fr 1fr` with no breakpoint — overflowed phones; now `.nature-pair`, stacks <820px.
- **Features page imagery**: Maya lifestyle photo behind the how-it-works fold (`6f7e9d7`); Border Scan mock shows the scan landing on the plan — dahlia camera view + ON YOUR PLAN inset (`c5661ff`); "Calm about it, never alarmist." dropped from health lead per Richard (`ece3c50`).
- **Inspired by Gardn before/after rebuilt three times to Richard's spec** (`fc32233`→`96cc4b5`→`d9f11ba`+`9b0c126`+`6eedaa7`): final form is Richard's own IMG_1078 border photo as "Now" and an enhanced variation of the *same frame* as "Inspired" (golden grade + composited iris drift / forget-me-nots / kniphofia, built with Pillow). Chips renamed to the plants actually in shot. Shared pair on home + features.
- **Founders photo** (Drive folder, deckchairs shot) into story.html Who's-building-it as a feature block (`26d69d3`). NB the Drive folder also contains family photos incl. a child — not used, deliberately.
- **Bloom sprig divider removed site-wide** per Richard — "not in the brand design" (`9adc375`; pushed at session end).
- **Full site review delivered.** Clean: voice (zero banned vocab/exclamations), links, JSON-LD, alts, headers, all 12 sitemap URLs 200. Found: **pricing.html og:image → /og.png which doesn't exist** (HIGH, unfixed); **docs say `POST /api/waitlist` but the real, working endpoint is `/api/subscribe`** (docs corrected this session in CLAUDE.md + architecture.md); home page ~5.2MB assets (WebP pass owed); photo-hands.jpg 3MB unused; delete-account.html headings missing full stops; features wildlife shot still the old capture.
- **Wordmark "contradiction" investigated and dissolved**: the app renders the uppercase GARDN lockup artwork (GardnLogo → lockupHorizontal); the `typography.ts` wordmark token is unused and case-silent; ops kit + site agree uppercase. Yesterday's "app token lowercase" note was wrong — open decision closed.
- **Cross-repo flag (gardn-native)**: all locale files tell users to email **support@gardn.app** — wrong domain, registered May 2022 via Namecheap by a third party (MX → mx.plingest.com). Real address is support@gardn.world. Fix in gardn-native before launch. Also: paywall links gardn.world/privacy.html (308→/privacy, works; could link /privacy directly), and privacy@gardn.world alias should be confirmed to exist in Google Admin.
- PR #1 (`codex/estate-sync-sentinels`) assessed at session start: copy half superseded by `022d069` (would re-introduce "unlocks"); CI canon-check half is good and worth cherry-picking with terms.html handled as flag-not-fail. Unresolved.

### Current state

Site live with a full imagery pass: map-first home narrative, real photos/designed mocks in every phone frame, Maya hero on features, same-photo Inspired before/after from Richard's own garden, founders on story, bloom divider gone. Review verdict: structurally healthy; two HIGH items open (pricing og:image 404; PR #1 resolution), plus the strapline call on title/og/manifest, page-weight pass, repo still public, terms.html solicitor bundle.

### Next

Fix pricing.html og:image (points at non-existent /og.png), then resolve PR #1 (cherry-pick canon CI, close copy half).

### Promote to DECISIONS?

Yes — two:
1. **Inspired by Gardn before/after must be the same photograph**: real sparse frame as "Now", enhanced variation of that exact frame as "Inspired" (Richard, 2026-06-12). Never two different scenes, never a plan-to-render pairing.
2. **No bloom sprig divider** — not in the brand design (Richard, 2026-06-12). Seasonal colour drift alone carries section transitions.

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
