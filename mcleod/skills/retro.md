---
name: retro
version: 3
description: Reflection in two modes — session (default — three questions, append a Retro block to today's session log) and estate (/retro estate — cross-repo retrospective over the whole portfolio: what shipped, recurring blockers, cold projects, estate-level Skillify candidates). Both feed Skillify.
triggers:
  - "retro"
  - "what went well"
  - "reflect on"
  - "end of session"
  - "/retro estate"
  - "estate retro"
  - "cross-repo retro"
  - "what shipped across the estate"
allowed-tools:
  - Read
  - Edit
  - Bash
reads:
  - state/sessions/YYYY-MM-DD.md (if it exists)
  - state/CURRENT_SESSION.md
  - "session commit log"
  - "estate mode — scripts/estate-state-read.mjs (live project_state across all repos)"
writes:
  - "session mode — appends ## Retro block to state/sessions/YYYY-MM-DD.md"
  - "estate mode — writes state/sessions/estate-retro-YYYY-MM-DD.md"
calls: "feeds Skillify (Layer 3, deferred) — does not invoke it directly"
---

# Skill: retro

Adapted from GStack's `retro` — its `/retro global` cross-project mode informs **estate mode** (2026-06-01). Two modes: **session** (default) and **estate** (`/retro estate`).

## Purpose

Reflection that turns experience into durable improvement. Session mode captures what worked/didn't this session; estate mode surfaces the cross-repo patterns no single-repo retro can see. Both feed Skillify, which will eventually turn high-frequency patterns into new skills, capabilities, or rule updates.

## Session mode (default)

### Procedure

1. Skim the session log (commits, files changed, decisions reached). Note the actual arc, not the planned one.
2. Ask three questions, one at a time, pop-up format where the answer is bounded:
   - **What worked?** Free text. Specific moments, not "everything went well".
   - **What didn't?** Free text. Specific friction, not "more clarity needed".
   - **What would a permanent fix look like?** Pop-up format with: *new skill* / *update existing skill* / *update CLAUDE.md rule* / *nothing — one-off* / *not sure yet*.
3. Write the block:

   ```markdown
   ## Retro

   ### What worked
   - <bullet>

   ### What didn't
   - <bullet>

   ### Skillify candidates
   - <pattern> → <new skill | update <skill> | new CLAUDE.md rule | none>
   ```

4. End with a yes/no question: "Flag any of these to BACKLOG for action, or leave them in the retro?"

### Quality bar

- At least one specific moment named under "what worked" and "what didn't" — not generic ("communication was great"). If the session was genuinely smooth, say so plainly in one line and move on.
- Skillify candidates section either names a candidate or says "none this session" explicitly.

### Anti-patterns

- Retroactively rewriting what happened to look better than it was.
- Skipping "what didn't" because it feels uncharitable. The point of the retro is exactly this section.
- Auto-creating new skills from the retro. That's Layer 3's job; for now, just log the candidate.
- Letting the retro become its own session — keep it under 5 minutes of conversation.

## Estate mode (`/retro estate`)

A cross-repo retrospective over the whole portfolio. Where session mode reflects on *this* session in *this* repo, estate mode answers the question a single-repo retro structurally cannot: **what patterns span the estate?** It reads the orchestrator's live state — the same `project_state` data the McLeod hub renders — and synthesises what shipped, what's recurring, and what's gone cold across every project. Runs from the martina repo.

### Procedure

1. **Window.** Default 7 days. A trailing argument sets it: `/retro estate 14d`, `/retro estate 30d`.
2. **Read live estate state:**
   ```bash
   node scripts/estate-state-read.mjs --since <window>
   ```
   Parse the JSON on stdout.
   - `ok: true` → use `projects[]` (each has `slug`, `name`, `status`, `last_commit_at`, `days_since_commit`, `summary`, `shipped_recent[]`, `blockers[]`, `priority`).
   - `ok: false` → **degrade honestly.** The orchestrator DB key (`ORCHESTRATOR_DB_ROLE_KEY`) isn't in this environment. Tell the operator exactly that (quote the `reason`), then offer the fallback: ask them to paste the McLeod hub state, or proceed from the local `mcleod/projects/<slug>/` protocol docs (noting those are static, not live). Do not fabricate estate state you couldn't read.
3. **Synthesise the cross-cutting view** — NOT a per-project status dump (the McLeod hub already does that). Work these four lenses:
   - **What shipped across the estate** — roll up `shipped_recent` per project into the genuine movement of the window. Name the through-line if there is one ("three repos hardened RLS this week").
   - **Recurring / overlapping blockers** — scan every project's `blockers[]` for the *same blocker class* appearing in more than one repo, or a blocker that's persisted across windows. A blocker in one repo is that repo's problem; the same blocker in three is an estate problem worth a capability.
   - **Cold projects** — flag projects whose `days_since_commit` exceeds the window, weighted by `status`: a `live` or `active` project gone quiet is a real signal; a `planning` or `paused` one going quiet is expected. (Mirrors the McLeod staleness banner's >3-day threshold.)
   - **Estate-level Skillify candidates** — patterns spanning repos that a per-repo retro misses: a manual step repeated in N projects (→ capability), a rule re-litigated estate-wide (→ CLAUDE.base.md), a skill that should exist everywhere.
4. **Write the block** to `state/sessions/estate-retro-YYYY-MM-DD.md` (today's date):

   ```markdown
   ## Estate retro — <date range> (<window>)

   ### Shipped across the estate
   - <project>: <one line of what moved>

   ### Cross-cutting blockers (the estate view)
   - <blocker pattern> → <projects it appears in>

   ### Cold projects (main quiet)
   - <project> — <N>d since last commit (status: <status>) — <real signal | expected>

   ### Estate-level Skillify candidates
   - <pattern spanning repos> → <new skill | update <skill> | new capability | new CLAUDE.base rule | none>
   ```

5. End with a yes/no question: "Flag any of these to BACKLOG (martina or the affected project) for action, or leave them in the estate retro?"

### Quality bar

- Every claim traces to the read data — name the project and the figure (`days_since_commit`, the blocker text). No estate state asserted that the helper didn't return.
- The output is *cross-cutting*. If a section just restates one project's status, it doesn't belong — that's the hub's job, not the retro's.
- "Nothing cross-cutting this window" is a valid finding for any lens, stated explicitly after showing what you scanned.
- Cold-project flags are weighted by status, not raw — don't cry wolf on a `planning` repo that was never going to move.

### Anti-patterns

- Reproducing the McLeod hub: a per-project status table is not an estate retro. The value is the pattern that spans repos.
- Inventing blockers or shipped work not present in the read data.
- Treating a single-repo blocker as an estate problem — it's only estate-level if it recurs across projects or persists across windows.
- Silently proceeding when the live read failed. Degrade out loud; an estate retro built on stale local docs that claims to be live is the exact "confused output" `ambition.md` names as fatal.
