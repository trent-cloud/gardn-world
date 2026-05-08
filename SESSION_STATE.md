# SESSION_STATE.md

> The single read-first file for `gardn-world`. Updated at the end of every session. If you're starting a session, **read this file first**, then `CLAUDE.md`, then `~/Documents/Gardn App/gardn-docs/15-site-copy.md` (copy source-of-truth) and `14-action-tracker.md` (broader project state). Don't touch code until you've read all four.

**Last updated:** 2026-05-08 (mobile rendering pass — second session-close of the day)
**Current head:** `e23850d` on `main` (pushed)
**Live URL:** [https://gardn.world](https://gardn.world)

---

## Live now

The site is live, the waitlist works, and the Privacy Policy is solicitor-signed and shipped.

**Stack:** Astro 6.3.1 + Tailwind CSS 4 + TypeScript strict + `@astrojs/vercel` adapter + `@astrojs/sitemap`. Auto-deploys from `main` to Vercel.

**DNS:** GoDaddy A `@` → `76.76.21.21` (Vercel apex), CNAME `www` → `cname.vercel-dns.com`.

**Resend:** `RESEND_API_KEY` + `RESEND_AUDIENCE_ID` set in Vercel envs (Production + Preview). Waitlist tested live and working.

**Pages:**

- `/` — 5-block home per Doc 15: Hero (locked tagline pair, no eyebrow) → Memory section (dominant) → 3 proof points → Waitlist (pre-launch) → Footer.
- `/privacy` — solicitor-signed v1.0 (Gardn Labs Ltd, Company No. 17195491, 124-128 City Road, London, EC1V 2NX, dated 2026-05-08).
- `/terms` — **holding page** (Richard owes solicitor copy).
- `/support` — Doc 15 rewrite, no FAQ, two emails (`help@gardn.world`, `hello@gardn.world`).
- `/blog` — "A gardener's notebook" intro per Doc 15.

**Logo:** horizontal lockup PNG used everywhere. Header `h-9 md:h-[52px]` (mobile shrunk after the +30% bump pushed past the nav breakpoint), Footer `h-6`. Favicon stays as the icon-only mark.

**Mobile rendering:** hero h1 / sub-line / gradient / logo all pass an iPhone 14/15 (390px) layout. Audit + fix landed `e23850d`. `.text-display` is now fluid via `clamp(36px, 8vw, 56px)`; sub-line uses an inline `clamp(17px, 4vw, 28px)`; gradient mid-stop bumped 10% → 40% so the headline doesn't sit in the bright band.

---

## Outstanding (priority order)

### 1. Terms of Service v1.0 — **blocks launch** (P0.3 in `14-action-tracker.md`)

Richard owes solicitor-signed copy. Drop-in pattern, ~5 minutes:

1. Write `src/pages/terms.md` mirroring the `privacy.md` frontmatter.
2. Use the same registered office: **Gardn Labs Ltd, 124-128 City Road, London, EC1V 2NX, Company No. 17195491**.
3. Delete `src/pages/terms.astro`.
4. Build, push.

`LegalLayout.astro` + `.prose-legal` styles already do the rendering. No CSS work needed.

### 2. Email routing — **blocks user trust**

Doc 15 introduces `help@gardn.world` (users) and `hello@gardn.world` (press / partnerships). Verify both route to a live inbox. Until they do, anyone emailing those bounces silently. If only one routes, fold both into the live one (Doc 15 prefers `hello@`).

### 3. Launch-day swap — target **2026-05-26**

Pre-launch state retires; post-launch state goes live. Doc 15 has both copy variants ready.

- **Hero:** replace the paper "Join the waitlist" button with the App Store + Google Play badge images. Real listing URLs replace the `#app-store-link-tbd` / `#google-play-link-tbd` placeholders. Secondary "See what it does ↓" anchor stays.
- **Block 4 waitlist module:** replace with the *"Available now."* / *"Start with your first plant."* download module per Doc 15. Optional sub-line *"£5.99/month or £49.99/year. Cancel anytime."* if conversion data justifies it.
- **CLAUDE.md + Doc 15 change-log:** record the swap.

### 4. Lower priority follow-ups

- **Sentry + analytics** — explicitly deferred. Add post-launch (P1.1, P1.2 in `14-action-tracker`).
- **LinkedIn social handle** — Doc 15 says add to footer once company page exists.
- **YouTube / Threads / Bluesky** — not yet reserved per Doc 02.
- **Per-page OG images** — currently every page uses `og-default.jpg`. Future: tagline-overlaid 1200×630 for the home page.
- **Hero sub-line letter-spacing on mobile** — the sub-line still inherits `letter-spacing: -0.7px` from `.text-h2`; at the new 17px mobile size that's slightly tight. Marginal polish, flagged in the mobile-rendering Phase 2 report. Not a Phase 3 priority.
- **Hero gradient mood** — current overlay (`0.50 / 0.40 / 0.85`) is the heavier of the two recommended options. If on a closer look the hero feels too cinematic, swap line 53 of `index.astro` to the lighter alternative (`0.45 / 0.30 / 0.85`). One-line edit.
- **Memory section photo height on mobile** — `h-[480px]` consumes the entire mobile fold of the section (audit Priority 5, deliberately deferred). Reduce to `h-[320px]` if the pacing bothers anyone.

---

## Next-session pickup

Most likely entry points:

| You say… | First action |
|----------|--------------|
| *"Start session"* | Read this file + `CLAUDE.md` + Docs 15 / 14, then ask what's needed. |
| *"Terms is in"* | Drop-in via the `privacy.md` pattern (see Outstanding #1). |
| *"We're launching today / tomorrow"* | Run the launch-day swap (see Outstanding #3). |
| *"Tweak the [whatever]"* | Edit, push, done — Vercel auto-deploys. |

---

## Repo conventions (recap)

- **Tailwind v4** — tokens live in `src/styles/global.css` under `@theme`. There is no `tailwind.config.mjs`.
- **Astro Vercel adapter** — `/api/waitlist` uses `prerender = false` to deploy as a serverless function.
- **Brand photos** — always via `astro:assets` `<Image />`, never raw `<img>`. Imports flow through `src/constants/brandAssets.ts`.
- **Long-form legal pages** — markdown (`.md`) + `LegalLayout.astro` + `.prose-legal` style scope. Edit copy as plain markdown.
- **Pushes to `main`** auto-deploy on Vercel. No staging gate.
- **Brand voice** — `~/Documents/gardn-native/BRAND_VOICE.md` is the spec. Doc 15 is the applied layer for this site. Doc 10 is the positioning frame.

---

## Today's commits (14, all on `main`)

| Hash | Subject |
|------|---------|
| `7d67fda` | Phase 1 scaffold: Astro 5 + Tailwind 4 + TypeScript |
| `64c5f58` | Phase 2: real copy, store badges, footer, SEO |
| `08e4251` | Phase 2 docs: CLAUDE.md — phase-status, voice reminder, copy guide |
| `6edadb1` | Privacy Policy v1.0 live (solicitor-signed) |
| `e25013a` | CLAUDE.md: legal-pages pattern + Privacy v1.0 phase note |
| `66555f9` | Privacy: correct Gardn Labs Ltd registered office address |
| `524a383` | CLAUDE.md: pin Gardn Labs Ltd registered office for future Terms drop-in |
| `d4224b6` | Header: swap icon + text wordmark for the horizontal lockup |
| `3e97645` | Footer: replace text wordmark with the horizontal lockup |
| `0b76389` | Header: enlarge lockup (h-7/8 → h-9/10) per co-founder review |
| `288b273` | Apply Doc 15 site copy: 5-block home + new memory section |
| `82ae94f` | Hero: drop "A garden assistant" eyebrow; header lockup +30% |
| `8d57286` | Close session: SESSION_STATE.md + CLAUDE.md pickup convention |
| `e23850d` | fix(site): mobile hero + nav rendering pass |

---

## End-of-session protocol

When ending a session, update this file in place:

1. Bump *Last updated* to today.
2. Update *Current head* to the latest commit hash on `main`.
3. Move anything newly shipped from *Outstanding* → *Live now*.
4. Add anything new to *Outstanding* if it surfaced.
5. Append the session's commits to *Today's commits* (or rotate the table if it's getting long).

That's it — keep this file the single source of pickup truth.
