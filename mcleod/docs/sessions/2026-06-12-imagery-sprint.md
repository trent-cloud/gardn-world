## What changed

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

## Current state

Site live with a full imagery pass: map-first home narrative, real photos/designed mocks in every phone frame, Maya hero on features, same-photo Inspired before/after from Richard's own garden, founders on story, bloom divider gone. Review verdict: structurally healthy; two HIGH items open (pricing og:image 404; PR #1 resolution), plus the strapline call on title/og/manifest, page-weight pass, repo still public, terms.html solicitor bundle.

## Next

Fix pricing.html og:image (points at non-existent /og.png), then resolve PR #1 (cherry-pick canon CI, close copy half).

## Promote to DECISIONS?

Yes — two:
1. **Inspired by Gardn before/after must be the same photograph**: real sparse frame as "Now", enhanced variation of that exact frame as "Inspired" (Richard, 2026-06-12). Never two different scenes, never a plan-to-render pairing.
2. **No bloom sprig divider** — not in the brand design (Richard, 2026-06-12). Seasonal colour drift alone carries section transitions.
