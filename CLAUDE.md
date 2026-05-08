# CLAUDE.md — gardn-world

Marketing-only website for Gardn. **Not** the product.

## Stack

- Astro 6.3.1 (with `@astrojs/vercel` adapter for serverless endpoints + `@astrojs/sitemap` for `sitemap-index.xml`)
- Tailwind CSS 4 (CSS-first config — tokens live in `src/styles/global.css` under `@theme`)
- TypeScript (strict)
- Deployed to Vercel at `https://gardn.world`; preview URL per branch.

## Phase status

- **Phase 1 — 2026-05-08, commit `7d67fda`.** Scaffold + brand foundation + skeleton routes + env-gated waitlist endpoint.
- **Phase 2 — 2026-05-08, commit `64c5f58`.** Real copy across hero / features / waitlist / blog / support, polished Privacy + Terms holding pages, real App Store + Google Play badge artwork, four-icon footer linking to `@gardnworld` socials, full SEO (per-page meta, OG + Twitter Card, canonical, sitemap, robots, 1200×630 og-default.jpg). DNS cutover to `gardn.world` and Resend env-var wiring are owed manually by Trent.

## Brand source of truth

`~/Documents/gardn-native/` — specifically `src/theme/colors.ts`, `src/theme/typography.ts`, `assets/brand/`, `BRAND_VOICE.md`. If brand tokens drift in `gardn-native`, re-port; do not edit them in isolation here.

## Brand voice reminder

Before writing or editing any user-facing copy on this site, read `~/Documents/gardn-native/BRAND_VOICE.md` end-to-end. The anti-patterns hold absolutely:

- No SaaS verbs (*leverage*, *optimise*, *unlock*, *empower*, *supercharge*).
- No twee plant-app vocabulary (*plant parent*, *plant baby*, *thriving* as a category, *green thumb*, *plant fam*).
- No filler over-positives (*lovely*, *wonderful*, *delightful*, *amazing*).
- End every heading with a full stop unless it's a question. Single-word headings included. Eyebrows (uppercase tracked labels) excluded.

The marketing register can breathe a little more than in-product copy — longer sentences, slightly more poetic — but the voice is the same.

Positioning substrate: `~/Documents/Gardn App/gardn-docs/10-usp.md` (Messaging house + Three pillars). Don't invent positioning that contradicts Doc 10.

## How to update copy

- Page-level copy lives in `src/pages/*.astro` and `src/pages/blog/index.astro`.
- Shared chrome lives in `src/components/Header.astro` and `src/components/Footer.astro`.
- Layout meta defaults live in `src/layouts/BaseLayout.astro` (per-page overrides via the `title` / `description` / `ogImage` Astro props).
- Pushes to `main` auto-deploy on Vercel. There is no preview/staging gate beyond per-branch Vercel previews.

## What NOT to add

- No analytics, no Sentry, no auth, no product features. This is a marketing site.
- No CMS or MDX layer — pages are simple enough as `.astro` files.
- No real Privacy or Terms text without solicitor sign-off. Holding messages only until Richard delivers.
- No additional social handles in the footer — only `@gardnworld` Facebook / X / Instagram / TikTok are reserved. YouTube / Threads / Bluesky / LinkedIn are not yet reserved.
- No real App Store / Google Play URLs until the listings are approved post-launch — links are `#app-store-link-tbd` / `#google-play-link-tbd` placeholders.

## Image rendering

Always use Astro's `<Image />` from `astro:assets` for brand photos. Never raw `<img>`. Static imports flow through `src/constants/brandAssets.ts`. The two store badges (`public/badges/*`) are the only exception — they're fixed-dimension store artwork, not brand photography.

## Waitlist

`POST /api/waitlist` → Resend Audiences. Env-gated (`RESEND_API_KEY`, `RESEND_AUDIENCE_ID`); missing env returns graceful 503 so previews don't 500. Set both vars in Vercel → Project Settings → Environment Variables before launch.

## SEO

- `astro.config.mjs` declares `site: 'https://gardn.world'`, which `@astrojs/sitemap` and `BaseLayout.astro` canonical/OG URL building depend on.
- `og-default.jpg` is a 1200×630 derivative of `photoMeadow` generated via `sips`. Per-page `ogImage` prop overrides the default if needed.
- `robots.txt` allows all crawlers and points to `sitemap-index.xml`.
