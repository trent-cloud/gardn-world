# SESSION_STATE.md

> The single read-first file for `gardn-world`. Updated at the end of every session. If you're starting a session, **read this file first**, then `CLAUDE.md`, then `~/Documents/Gardn App/gardn-docs/15-site-copy.md` (copy source-of-truth) and `14-action-tracker.md` (broader project state). Don't touch code until you've read all four.

**Last updated:** 2026-05-11 (Privacy v2.0 rewrite + Terms v1.0 draft landed — uncommitted at time of writing)
**Current head:** `e23850d` on `main` (pushed) — local working tree dirty: new `src/pages/terms.md`, rewritten `src/pages/privacy.md`, removed `src/pages/terms.astro`, doc updates
**Live URL:** [https://gardn.world](https://gardn.world)

---

## Live now

The site is live and the waitlist works. Privacy v2.0 and Terms v1.0 are both drafted into the repo (not yet solicitor-signed — see Outstanding #1).

**Stack:** Astro 6.3.1 + Tailwind CSS 4 + TypeScript strict + `@astrojs/vercel` adapter + `@astrojs/sitemap`. Auto-deploys from `main` to Vercel.

**DNS:** GoDaddy A `@` → `76.76.21.21` (Vercel apex), CNAME `www` → `cname.vercel-dns.com`.

**Resend:** `RESEND_API_KEY` + `RESEND_AUDIENCE_ID` set in Vercel envs (Production + Preview). Waitlist tested live and working.

**Pages:**

- `/` — 5-block home per Doc 15: Hero (locked tagline pair, no eyebrow) → Memory section (dominant) → 3 proof points → Waitlist (pre-launch) → Footer.
- `/privacy` — **v2.0 draft** (2026-05-11). 17-section rewrite by user. Supersedes the solicitor-signed v1.0 (2026-05-08, `6edadb1`). Pending legal review of the new structure + the Stage 1 opt-in-by-default flag (note embedded in the doc).
- `/terms` — **v1.0 draft** (2026-05-11). 16-section user-authored copy; replaces the `terms.astro` holding page. Pending solicitor sign-off. Section 11 (limitation of liability) carries an inline legal-review note flagging Consumer Rights Act 2015 / UCTA 1977.
- `/support` — Doc 15 rewrite, no FAQ, two emails (`help@gardn.world`, `hello@gardn.world`).
- `/blog` — "A gardener's notebook" intro per Doc 15.

**Logo:** horizontal lockup PNG used everywhere. Header `h-9 md:h-[52px]` (mobile shrunk after the +30% bump pushed past the nav breakpoint), Footer `h-6`. Favicon stays as the icon-only mark.

**Mobile rendering:** hero h1 / sub-line / gradient / logo all pass an iPhone 14/15 (390px) layout. Audit + fix landed `e23850d`. `.text-display` is now fluid via `clamp(36px, 8vw, 56px)`; sub-line uses an inline `clamp(17px, 4vw, 28px)`; gradient mid-stop bumped 10% → 40% so the headline doesn't sit in the bright band.

---

## Outstanding (priority order)

### 1. Solicitor sign-off on Privacy v2.0 + Terms v1.0 — **blocks launch** (P0.3 in `14-action-tracker.md`)

Both pages are live in the repo but neither is signed off. Richard / counsel pass:

- **Privacy v2.0** (`src/pages/privacy.md`) — substantial rewrite vs the signed v1.0. Specific items to flag for counsel:
  - **Stage 1 consent default-on** — section 6 ships Stage 1 (Anonymised aggregate use) as opt-in-by-default. Confirm with counsel that this is defensible under UK GDPR / ICO guidance for aggregated phenology data with district-only aggregation. If counsel pushes back, flip Stage 1 default to off in both the policy text and the in-app consent UI.
  - Third-party processor list changed materially (Vercel / Expo / Google Play removed; postcodes.io / Apple Inc. / Google LLC broken out).
  - Entity name throughout is now "Gardn Labs Limited" (matches Companies House) vs prior "Gardn Labs Ltd".
- **Terms v1.0** (`src/pages/terms.md`) — first published version, footer reads *"Draft for legal review"*. Specific items to flag for counsel:
  - **Section 11 (limitation of liability)** carries an inline note asking for a full pass against Consumer Rights Act 2015 + UCTA 1977.
  - **Section 14 (Apple App Store)** — confirms Apple as third-party beneficiary; standard boilerplate but worth a sanity-check.
  - **Section 4** locks Premium pricing at £5.99/mo or £49.99/yr. Coordinate with App Store Connect SKUs before any further price change.

When sign-off lands: paste signed text into the existing `.md` files, bump versions + "Last updated", strip the "Draft for legal review" suffix from `terms.md` and the section-11 note, decide on the Stage 1 visible-note in `privacy.md`, update the CLAUDE.md phase-status rows, commit, push.

### 2. Email routing — **blocks user trust** (decided 2026-05-10: Google Workspace)

Doc 15 introduces `help@gardn.world` (users) and `hello@gardn.world` (press / partnerships). Confirmed bouncing as of 2026-05-10 — `dig MX gardn.world` returns nothing, so anyone emailing those addresses gets an immediate SMTP failure.

**Chosen approach: Google Workspace Business Starter (~£4.60/user/month).** Real mailboxes, can send *from* `help@`/`hello@`, room to grow.

**Seat structure (decided):**

- One paid user: `trent@gardn.world` (admin)
- Two free **groups**: `hello@gardn.world` + `help@gardn.world`, both delivering into `trent@`
- When Richard joins: add `richard@gardn.world` as a second seat, drop him into both groups
- Total at launch: £4.60/mo solo, £9.20/mo with Richard. Groups (not aliases) so we can fan out without restructuring later.

**Sequence:**

| Step | Owner | What |
|---|---|---|
| 1. Sign up at `workspace.google.com` | Trent | Business Starter, Gardn Labs Ltd, domain `gardn.world`, admin user `trent@gardn.world` |
| 2. Verify domain ownership | Trent + Claude | Paste Google's TXT record into GoDaddy DNS |
| 3. Add MX record | Trent + Claude | Google's single-MX value: `smtp.google.com` priority 1 |
| 4. Create `hello@` + `help@` groups | Trent | Google Admin Console → Groups, both deliver into `trent@` |
| 5. SPF + DKIM + DMARC | Trent + Claude | Three TXT records at GoDaddy for deliverability |
| 6. End-to-end verification | Claude | `dig` the records + send test mail to both addresses |

**Flag before step 5:** the waitlist sends via Resend. If Resend is set up to send from `gardn.world` itself (not a `send.gardn.world` subdomain), the SPF record must `include:` both Google and Resend. Check `dig TXT gardn.world` after step 1 to see what (if anything) Resend already added, then merge — don't overwrite.

### 3. Pre-launch marketing momentum — kickoff **2026-05-11**

Build content velocity into launch (T-15 from kickoff). Goal: 2-3 social posts/day across reserved handles, image-rich, in Doc 15 voice.

**Shape — human-in-the-loop, not autonomous agents:**

1. **Image factory** — ChatGPT + Nano Banana for social tiles (1080×1080 IG, 1200×675 X, 1080×1920 stories) and lifestyle variants. Trent approves every output.
2. **Draft pipeline** — Claude drafts 5-7 posts/week in Doc 15 voice from a new `/social-drafts/` folder in this repo. Trent reviews + approves.
3. **Scheduled posting** — Buffer or Meta Business Suite. Batch-approve a week of drafts on Sunday, scheduler posts 2-3x/day.
4. **Engagement stays human** — founder voice in groups/threads, 15 min/day Trent + Richard.

**Why not autonomous engagement agents:** Instagram, TikTok, Reddit, Facebook actively detect and ban automated engagement. At T-15 from launch, a `@gardnworld` suspension is catastrophic (1-3 week appeal windows). Doc 15's community pillar also commits Gardn to *not* mass-engaging — the brand cost of being caught is unrecoverable pre-launch.

**Prerequisite (~30 min):** Reserve `@gardn` on Instagram, X, YouTube, TikTok, Threads, Bluesky, LinkedIn (Doc 14 NEXT 14 DAYS marketing-readiness list, currently unchecked). `@gardnworld` stays as fallback on platforms where `@gardn` isn't reservable.

**Tomorrow's concrete moves (2026-05-11):**

- [ ] Reserve handles on the 7 platforms
- [ ] Pick scheduler (Buffer £6/mo or Meta Business Suite free)
- [ ] Stand up `/social-drafts/` folder + first week's 5-7 drafts
- [ ] First image batch: 3-5 tiles across proof-point themes (memory, frost alerts, regional accuracy)
- [ ] 15-min listening pass on r/gardening, r/UKGardening — find threads worth noting, no posting yet

### 4. Launch-day swap — target **2026-05-26**

Pre-launch state retires; post-launch state goes live. Doc 15 has both copy variants ready.

- **Hero:** replace the paper "Join the waitlist" button with the App Store + Google Play badge images. Real listing URLs replace the `#app-store-link-tbd` / `#google-play-link-tbd` placeholders. Secondary "See what it does ↓" anchor stays.
- **Block 4 waitlist module:** replace with the *"Available now."* / *"Start with your first plant."* download module per Doc 15. Optional sub-line *"£5.99/month or £49.99/year. Cancel anytime."* if conversion data justifies it.
- **CLAUDE.md + Doc 15 change-log:** record the swap.

### 5. Lower priority follow-ups

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
| *"Counsel signed off on privacy/terms"* | Paste signed text into existing `.md` files, bump versions, strip draft markers (see Outstanding #1). |
| *"Let's do the marketing kickoff"* | Start the 5-step list under Outstanding #3. |
| *"We're launching today / tomorrow"* | Run the launch-day swap (see Outstanding #4). |
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
