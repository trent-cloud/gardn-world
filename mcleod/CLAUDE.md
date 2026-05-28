# CLAUDE.md — gardn-world

Marketing-only website for Gardn. **Not** the product.

## Session protocol

Session-start and session-end protocols are owned by the canonical files in this repo's `mcleod/` folder:

- **Session start** — follow `mcleod/SESSION_START.md`. It defines the reading-list order, the alignment-check format, and the default behaviours. Do not maintain a duplicate reading list here.
- **Session end** — follow `mcleod/SESSION_END.md`. Produces the four-section block, overwrites `mcleod/CURRENT_SESSION.md`, prepends to `mcleod/context/recent-sessions.md` (trim to 3), writes the dated archive at `mcleod/docs/sessions/YYYY-MM-DD.md`, updates `mcleod/MCLEOD_STATE.md`.

The legacy `SESSION_STATE.md` rolling-snapshot flow is **retired**. Its content was migrated to `mcleod/MCLEOD_STATE.md` and the file was deleted from the repo root on 2026-05-14.

No hooks or auto-skills are configured — convention only. If we ever want automation, set up a `.claude/commands/` slash command or a `SessionStart` hook in `settings.json`.


## Stack

- Astro 6.3.1 (with `@astrojs/vercel` adapter for serverless endpoints + `@astrojs/sitemap` for `sitemap-index.xml`)
- Tailwind CSS 4 (CSS-first config — tokens live in `src/styles/global.css` under `@theme`)
- TypeScript (strict)
- Deployed to Vercel at `https://gardn.world`; preview URL per branch.

## Phase status

- **Phase 1 — 2026-05-08, commit `7d67fda`.** Scaffold + brand foundation + skeleton routes + env-gated waitlist endpoint.
- **Phase 2 — 2026-05-08, commit `64c5f58`.** Real copy + App Store + Google Play badge artwork + four-icon footer + full SEO. DNS cutover and Resend env vars done same day; site fully live and waitlist functional.
- **Privacy Policy v1.0 — 2026-05-08, commit `6edadb1` (+ address fix `66555f9`).** Solicitor-signed text wired into `/privacy` (Gardn Labs Ltd, Company No. 17195491, 124-128 City Road, London, EC1V 2NX).
- **Privacy Policy v2.0 — 2026-05-11.** Full rewrite to a 17-section structure: separate 5a/5b data-collection tables (direct vs automatic), expanded third-party list (Supabase, postcodes.io, Anthropic, Plant.id, Mapbox, PostHog, Sentry, Resend, Apple, Google — Vercel / Expo / Google Play row dropped), new Service area (UK-only), Age (13+ with 13–17 guardian rule), Plant lifecycle and moments data, Wildlife and biodiversity data, ICO complaint section. Entity name switched from "Gardn Labs Ltd" to "Gardn Labs Limited" in the new copy. Stage 1 consent (Anonymised aggregate use) defaults to **on**, with the assumption that counsel will confirm opt-in-by-default is defensible for district-aggregated phenology observations under UK GDPR. **Solicitor-signed.**
- **Terms of Service v1.0 — 2026-05-11.** Drop-in via the `privacy.md` pattern: holding `src/pages/terms.astro` deleted, `src/pages/terms.md` created with 16 sections covering acceptance, eligibility (UK + 13+), accounts, subscription/billing (Free vs Premium £5.99/mo or £49.99/yr, 7-day trial, Apple-only billing), acceptable use, UGC, moderation, AI disclaimer, care guidance disclaimer, IP, limitation of liability, termination, Apple App Store boilerplate (Apple as third-party beneficiary), governing law (England & Wales). **Solicitor-signed.**
- **Logo unification — 2026-05-08, commits `d4224b6` / `3e97645` / `0b76389` / `82ae94f`.** Horizontal lockup PNG replaces the icon + text wordmark in header and footer. Favicon stays as the icon-only mark.
- **Doc 15 site copy applied — 2026-05-08, commit `288b273` (+ refinement `82ae94f`).** Home page rebuilt to the 5-block structure: Hero (locked tagline pair, no eyebrow) → Memory section (dominant) → 3 proof points (smaller) → Waitlist (pre-launch state) → Footer. Footer tagline + meta defaults updated. Support page rewritten (no FAQ; `help@` + `hello@` emails). Notes page rewritten.
- **Mobile rendering pass — 2026-05-08, commit `e23850d`.** `.text-display` now fluid `clamp(36px, 8vw, 56px)` so the hero h1 scales from 56px (desktop) to ~36px (390px viewport). Mobile logo reverted to `h-9` (the +30% bump was desktop-only); desktop keeps `h-[52px]`. Hero sub-line uses inline `clamp(17px, 4vw, 28px)`. Hero gradient mid-stop opacity bumped 10% → 40% so the headline doesn't sit in the bright band. iPhone Safari now renders the hero at 2-3 balanced lines instead of 5.

## Brand source of truth

`~/Documents/gardn-native/` — specifically `src/theme/colors.ts`, `src/theme/typography.ts`, `assets/brand/`, `BRAND_VOICE.md`. If brand tokens drift in `gardn-native`, re-port; do not edit them in isolation here.

## Brand voice reminder

Before writing or editing any user-facing copy on this site, read `~/Documents/gardn-native/BRAND_VOICE.md` and `~/Documents/Gardn App/gardn-docs/15-site-copy.md` (the applied layer for *this site specifically*). Anti-patterns hold absolutely:

- No SaaS verbs (*leverage*, *optimise*, *unlock*, *empower*, *supercharge*, *transform*).
- No twee plant-app vocabulary (*plant parent*, *plant baby*, *thriving* as a category, *green thumb*, *plant fam*).
- No filler over-positives (*lovely*, *wonderful*, *delightful*, *amazing*).
- No exclamation marks anywhere on the site.
- End every heading with a full stop unless it's a question. Single-word headings included. Eyebrows (uppercase tracked labels) excluded.

The home page tagline pair — *"Notices what you'd miss. Remembers what you'd forget."* — is **locked**. Do not paraphrase. Sub-line is also locked.

Positioning substrate: `~/Documents/Gardn App/gardn-docs/10-usp.md` (Messaging house + Three pillars). Don't invent positioning that contradicts Doc 10. Doc 15 is the applied layer for this site; Doc 10 is the thinking.

## How to update copy

- Doc 15 (`gardn-docs/15-site-copy.md`) is the source-of-truth. **Change the doc first, then implement.** Not the other way round.
- Page-level copy lives in `src/pages/*.astro` (and `src/pages/blog/index.astro`, plus `src/pages/privacy.md` for legal).
- Shared chrome lives in `src/components/Header.astro` and `src/components/Footer.astro`.
- Layout meta defaults live in `src/layouts/BaseLayout.astro` (per-page overrides via the `title` / `description` / `ogImage` Astro props).
- Pushes to `main` auto-deploy on Vercel. There is no preview/staging gate beyond per-branch Vercel previews.

## Pre-launch / post-launch state

The home page currently runs the **pre-launch** copy (waitlist module, paper "Join the waitlist" hero button). At App Store launch (target 2026-05-26):

1. **Hero** — replace the "Join the waitlist" button with the App Store + Google Play badge images. Real listing URLs replace the `#app-store-link-tbd` / `#google-play-link-tbd` placeholders.
2. **Block 4 waitlist module** — replace with the *"Available now."* / *"Start with your first plant."* download module per Doc 15.
3. **Doc 15 + this file** — record the swap.

Doc 15 has both copy variants ready and the switch instructions are at the bottom of each affected section.

## Long-form legal pages

`/privacy` (and `/terms` when it lands) live as **markdown files** at `src/pages/privacy.md` and `src/pages/terms.md`, rendered through `src/layouts/LegalLayout.astro` (which wraps the slot in the `.prose-legal` style scope defined in `src/styles/global.css`). This keeps the legal text editable as plain markdown — no Astro syntax to wrangle when the solicitor returns a revision. Frontmatter pattern:

```md
---
layout: ../layouts/LegalLayout.astro
title: "Privacy — Gardn"
description: "..."
---
# Privacy Policy
...
```

Terms is now live at `src/pages/terms.md` (v1.0, 2026-05-11, solicitor-signed). Same registered office as `privacy.md` — **Gardn Labs Limited, 124-128 City Road, London, EC1V 2NX** (Company No. 17195491).

## What NOT to add

- No analytics, no Sentry, no auth, no product features. This is a marketing site. (Sentry + analytics land post-launch — P1.1 + P1.2 in `14-action-tracker.md`.)
- No CMS or MDX layer — pages are simple enough as `.astro` and `.md` files.
- Privacy v2.0 (2026-05-11) and Terms v1.0 (2026-05-11) are both live and **solicitor-signed**. Privacy v1.0 (2026-05-08) was the prior signed version; v2.0 supersedes it (also solicitor-signed). Flag any further substantive edits as needing legal sign-off before push.
- No additional social handles in the footer — only `@gardnworld` Facebook / X / Instagram / TikTok are reserved. LinkedIn comes once the company page is live (Doc 15). YouTube / Threads / Bluesky are not reserved.
- No real App Store / Google Play URLs until the listings are approved at launch — links are `#app-store-link-tbd` / `#google-play-link-tbd` placeholders.

## Image rendering

Always use Astro's `<Image />` from `astro:assets` for brand photos and the lockup. Never raw `<img>`. Static imports flow through `src/constants/brandAssets.ts`. The two store badges (`public/badges/*`) are the only exception — they're fixed-dimension store artwork, not brand photography.

## Logo placement

- **Header** — horizontal lockup PNG (`gardnLockupHorizontal`) at `h-9 md:h-[52px]` (mobile shrunk so it doesn't fight the 3-link nav at iPhone width; desktop kept the +30% bump). Sticky, on a `bg-gardn-paper/90 backdrop-blur` bar with `border-b border-gardn-line`.
- **Footer** — same lockup at `h-6`, above the *"A garden app that grows with you."* tagline.
- **Favicon** — icon-only mark (`gardn-mark.png` → `public/favicon.png`). Lockup is illegible at favicon size.

## Waitlist

`POST /api/waitlist` → Resend Audiences. Env-gated (`RESEND_API_KEY`, `RESEND_AUDIENCE_ID`) — both set in Vercel and tested live. Missing env returns graceful 503 so previews don't 500. Endpoint validates email shape before calling Resend.

## SEO

- `astro.config.mjs` declares `site: 'https://gardn.world'`, which `@astrojs/sitemap` and `BaseLayout.astro` canonical/OG URL building depend on.
- `og-default.jpg` is a 1200×630 derivative of `photoMeadow` generated via `sips`. Per-page `ogImage` prop overrides the default if needed.
- `robots.txt` allows all crawlers and points to `sitemap-index.xml`.
- Smooth-scroll is enabled in base CSS with 88px scroll-padding for the sticky header. `prefers-reduced-motion: reduce` falls back to instant scroll.
