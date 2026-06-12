# Architecture context — Gardn World (marketing)

Stack, key data model, key flows. Updated when something material lands or moves. Read for *how the system fits together*, not for non-negotiable rules — those live in `CLAUDE.md`.

> **2026-06-12 rewrite.** The previous version of this file described the original Astro 6 + Tailwind build under `src/`. That stack is retired — the site was rebuilt as plain static HTML at the repo root (the rebuild predates this rewrite; this file had not caught up).

## Stack

- **Plain static HTML/CSS/JS at the repo root** — no framework, no build step. Pages are `*.html`; shared styles in `site.css`; brand tokens in `tokens.css` (Figtree via Google Fonts `@import`); behaviour in `site.js`.
- **Hosting:** Vercel at `https://gardn.world`, `outputDirectory: "."`, `cleanUrls: true`, auto-deploy on push to `main`, per-branch previews, no staging gate.
- **`vercel.json`** carries: security headers including CSP (allows `fonts.googleapis.com` in style-src and `fonts.gstatic.com` in font-src — required for Figtree; do not remove), rewrites for `/notes/{border-scan,frost,memory}` → the `notes-*` pages and `/favicon.ico` → `/assets/favicon-96.png`.
- **`.vercelignore`** excludes `CLAUDE.md`, `README.md`, `mcleod/`, `docs/` from the deploy — the output directory is the repo root, so anything committed and not ignored is publicly served. Add new internal files to it.
- **Waitlist:** `POST /api/waitlist` (Vercel serverless function in `api/`) → Resend Audiences, env-gated.
- **No analytics, no CMS, no auth.** Marketing site, kept lean.

## Key files

- `index.html`, `features.html`, `pricing.html`, `story.html`, `notes.html` + `notes-*.html`, `support.html`, `privacy.html`, `terms.html`, `404.html`, `delete-account.html`, `auth/reset.html` — all pages, self-contained (header/footer markup duplicated per page; a cross-page chrome change is a sweep across all 15).
- `tokens.css` — brand colour/type tokens. **Known drift:** `--warm` is `#C4A46A`; canonical `colors.ts` moved to `#7D5F15` (WCAG). `site.css` consciously overrides `--muted-sub` to 0.68.
- `assets/` — Geoleaf marks (`gardn-mark.svg` forest vector, `gardn-mark-paper.svg` for dark surfaces, `gardn-mark.png` 1512px original kept for JSON-LD/manifest), favicon + apple-touch icons, brand photography, real app screenshots (`shot-*.png`, 560w convention).
- **Important path caveat:** the three `notes-*` pages are served at `/notes/<slug>` via rewrites, so **all their asset/link URLs must be absolute** (`/site.css`, `/assets/...`, clean-URL hrefs). Relative paths 404 there.

## Brand sources of truth

- `~/gardn-native/BRAND_VOICE.md` — voice spec (anti-patterns absolute).
- `~/gardn-native/src/theme/colors.ts` + `typography.ts` — design tokens.
- `~/gardn-ops` Brand Kit (`src/app/(portal)/brand-kit/`, assets in `public/brand/`) — logo artwork, tagline assets, **wordmark spec (uppercase "GARDN", 0.18em tracking)**. NB this contradicts the app's lowercase wordmark token — unresolved; founders to rule.
- `docs/10-usp.md` (in this repo) — positioning substrate. **Doc 15 (site copy) no longer exists anywhere** — the "change the doc first" workflow is suspended until it's recreated or formally retired.
- Social handles: Instagram `@gardn.world`; Facebook / X / TikTok `@gardnworld`.

## Key flows

- **Deploy:** push to `main` → Vercel static deploy (seconds). Verify with curl against the live URLs; the `cleanUrls` redirect serves `/features` etc.
- **Waitlist signup:** form post → `/api/waitlist` → Resend Audiences → success state with share button.
- **SEO:** `sitemap.xml` at root (promised by `robots.txt`), canonical + og tags per page, JSON-LD Organization/WebSite blocks (these reference `gardn-mark.png` — raster correct there).

## Open architectural follow-ups

- GitHub repo `trent-cloud/gardn-world` is **public** — internal docs readable there even though no longer served from the site. Flip to private.
- App Store / Play badges still `#app-store-link-tbd` placeholders pending launch.
- Title/og/manifest descriptors still carry "a garden app that grows with you" (strapline on-page is now "Grow together.").
