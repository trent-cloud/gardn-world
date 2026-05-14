# Architecture context — Gardn World (marketing)

Stack, key data model, key flows. Updated when something material lands or moves. Read for *how the system fits together*, not for non-negotiable rules — those live in `CLAUDE.md`.

## Stack

- **Framework:** Astro 6.3.1 with `@astrojs/vercel` adapter (serverless endpoints) and `@astrojs/sitemap` (`sitemap-index.xml`).
- **Styling:** Tailwind CSS 4 (CSS-first config — tokens in `src/styles/global.css` under `@theme`).
- **Language:** TypeScript (strict).
- **Hosting:** Vercel, deployed at `https://gardn.world`. Per-branch previews; `main` auto-deploys; no preview/staging gate.
- **Waitlist:** `POST /api/waitlist` → Resend Audiences. Env-gated (`RESEND_API_KEY`, `RESEND_AUDIENCE_ID`).
- **No analytics, no Sentry, no auth, no CMS** — marketing site, kept lean. Sentry + analytics land post-launch (see P1.1 + P1.2 in `14-action-tracker.md`).

## Key files

- `src/pages/*.astro` — page-level copy.
- `src/pages/privacy.md` + `src/pages/terms.md` — long-form legal, rendered through `src/layouts/LegalLayout.astro` (`.prose-legal` scope in `global.css`).
- `src/components/Header.astro` + `Footer.astro` — shared chrome.
- `src/layouts/BaseLayout.astro` — meta defaults (per-page overrides via Astro props).
- `src/constants/brandAssets.ts` — static imports for brand photos (Astro `<Image />` from `astro:assets`; never raw `<img>`).
- `src/api/waitlist.ts` — Resend endpoint with email validation and graceful 503 fallback.

## Key flows

- **Page render:** Astro static site generation → Vercel edge → user. Smooth scroll with 88px scroll-padding; `prefers-reduced-motion` falls back to instant.
- **Waitlist signup:** form post → `/api/waitlist` → Resend Audiences → success state.
- **SEO:** `astro.config.mjs` declares `site: 'https://gardn.world'`; sitemap-index auto-generated; `og-default.jpg` is a 1200x630 derivative of `photoMeadow`.

## Content sources of truth

- `~/Documents/gardn-native/BRAND_VOICE.md` — brand voice rules. Anti-patterns enforced rigorously (no SaaS verbs, no twee plant-app vocabulary, no exclamation marks, no filler over-positives).
- `~/Documents/Gardn App/gardn-docs/15-site-copy.md` — applied copy layer for this site specifically. Change the doc first, then implement.
- `~/Documents/Gardn App/gardn-docs/10-usp.md` — positioning substrate (Messaging house, Three pillars).
- `~/Documents/gardn-native/src/theme/*` + `assets/brand/` — brand tokens and photography. Re-port if these drift; do not edit in isolation here.

## Phase posture

- **Phase 1 (2026-05-08, `7d67fda`)** — scaffold + brand + skeleton routes + env-gated waitlist endpoint.
- **Phase 2 (2026-05-08, `64c5f58`)** — real copy + App Store + Google Play badge artwork + four-icon footer + full SEO. Site fully live and waitlist functional.
- **Privacy Policy v1.0 / v2.0** (2026-05-08, 2026-05-11) — solicitor-signed then user-rewritten. v2.0 pending solicitor sign-off.
- **Terms of Service v1.0 draft** (2026-05-11) — pending solicitor sign-off.
- **App Store launch swap** — pre-launch waitlist hero → post-launch App Store / Google Play badges, target 2026-05-26.

## Open architectural follow-ups

- Solicitor sign-off on Privacy v2.0 and Terms v1.0 (both currently flagged as draft).
- Post-launch analytics + Sentry (P1.1 + P1.2 in the action tracker).
- App Store / Play Store URLs replace `#app-store-link-tbd` / `#google-play-link-tbd` placeholders on launch day.
- LinkedIn company page once live (Doc 15).
