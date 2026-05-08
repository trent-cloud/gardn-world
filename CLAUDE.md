# CLAUDE.md — gardn-world

Marketing-only website for Gardn. **Not** the product.

## Stack

- Astro 5 (with `@astrojs/vercel` adapter for serverless endpoints)
- Tailwind CSS 4 (CSS-first config — tokens live in `src/styles/global.css` under `@theme`)
- TypeScript (strict)
- Deployed to Vercel; preview URL per branch.

## Brand source of truth

`~/Documents/gardn-native/` — specifically `src/theme/colors.ts`, `src/theme/typography.ts`, `assets/brand/`, `BRAND_VOICE.md`. If brand tokens drift in `gardn-native`, re-port; do not edit them in isolation here.

## What NOT to add

- No analytics, no Sentry, no auth, no product features. This is a marketing site.
- No real legal copy without solicitor sign-off (placeholders only).
- No App Store / Google Play badge images until they’re official.
- No custom domain config — `gardn.world` DNS is handled in Vercel/Cloudflare, not in this repo.

## Image rendering

Always use Astro’s `<Image />` from `astro:assets` for brand photos. Never raw `<img>`. Static imports flow through `src/constants/brandAssets.ts`.

## Waitlist

`POST /api/waitlist` → Resend Audiences. Env-gated (`RESEND_API_KEY`, `RESEND_AUDIENCE_ID`); missing env returns graceful 503 so previews don’t 500.
