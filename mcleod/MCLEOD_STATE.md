# MCLEOD_STATE.md

Update this file at the end of every session. The McLeod hub does NOT read this file (since 2026-05-16 it reads `project_state.project_updates` directly via Supabase; `summarise-project-state` writes that row daily at 02:00 UTC from main-branch commits). This file is the Claude.ai canonical-state surface read by per-project syncs.

---

<!-- updated: 2026-06-12 -->

## Current state

Marketing site live and materially more on-brand after a 15-commit brand-audit sprint (2026-06-12): real vector Geoleaf logo + favicon (previously none), Figtree actually loading (CSP had silently blocked Google Fonts since launch), reverse-trial copy truth on every page, "Grow together." footer strapline, place-first hero sub-line, footer social row (Instagram @gardn.world; Facebook/X/TikTok @gardnworld), notes pages fixed at canonical URLs, and internal docs (CLAUDE.md, mcleod/, docs/) no longer publicly served from gardn.world. Open decisions: wordmark case (ops Brand Kit uppercase vs app token lowercase), "Inspire" vs "Inspired by Gardn" naming, warm token drift, title/og/manifest strapline, and the GitHub repo still being public.

## Next

Flip `trent-cloud/gardn-world` to private (needs Trent's nod), then rule on the wordmark case and Inspire naming.
