# SESSION_END — Gardn

Run at the end of every Claude Code session in this project. Non-negotiable.

## Before you begin — branch-vs-main check

If your work this session is on a feature branch (not `main`), pick one of these before producing the session block:

- **(a) Merge to main first — recommended.** Session-end then records work that's now canonical on main. Everything downstream — `mcleod-sync` rebuilding `state.html`, Claude.ai's GitHub sync, the mirror propagating files — reads main only. Merging before session-end means those surfaces reflect reality immediately.
- **(b) Session-end on the branch with explicit caveat.** Only if the branch isn't ready to merge (review pending, dependencies unresolved). In that case the session block's `## Current state` MUST include the line: `Work landed on branch \`<branch>\`; not yet on main. Surfaces reading main (Claude.ai GitHub sync, state.html, downstream mirrors) will lag until merge.` And the `## Next` line MUST be the merge itself, or the prerequisite that unblocks it.

**Why this matters.** `mcleod-sync` (the daily 06:00 + 16:00 UTC job) reads `mcleod/MCLEOD_STATE.md` from main only — branch state never reaches `state.html`. Claude.ai brainstorming syncs main only. The McLeod card on the Martina hub shows main only. Session-ending on a branch without surfacing it means "Where are we?" answers diverge between Claude Code (reading the branch) and Claude.ai (reading main) — the going-in-circles failure mode.

## Step 1 — produce the session block

```markdown
## What changed
<bullet list — files touched, behaviours introduced, decisions made. terse.>

## Current state
<one or two sentences. where is this project right now?>

## Next
<one line. the single next concrete action.>

## Promote to DECISIONS?
<yes/no. if yes, the decision in one line and why it is locked.>
```

## Step 2 — overwrite mcleod/CURRENT_SESSION.md

Overwrite `mcleod/CURRENT_SESSION.md` at this repo's root with the session block from Step 1. Replace any previous content entirely — only the latest session belongs here. This is what Claude.ai reads when Trent or Richard starts a brainstorm; it must never contain stale or appended history.

## Step 3 — prepend to mcleod/context/recent-sessions.md, trim to 3

Prepend the session block to `mcleod/context/recent-sessions.md`. Trim to the **most recent three** blocks — older content stays preserved in `mcleod/docs/sessions/YYYY-MM-DD.md` (off the read path).

`CURRENT_SESSION.md` is the one-page handover; `recent-sessions.md` is the narrative-history surface that Claude reads for brainstorming context.

## Step 4 — write the dated archive

Write a dated archive copy to `mcleod/docs/sessions/YYYY-MM-DD.md` so the full session history is preserved off the read path.

If the session produced focused per-build or per-investigation artifacts (e.g. a fabrication audit, a rebuild result, a specific failure trace), write those as dated companion files at `mcleod/docs/sessions/YYYY-MM-DD-<topic>.md`. Reference them by name in the session block. This is the pattern Studio Woodlark Professional has used in `docs/learnings/` since 2026-05-07 — it lets the per-build narrative stay visible without bloating the main session block.

## Step 5 — update mcleod/MCLEOD_STATE.md

Edit `mcleod/MCLEOD_STATE.md` at this project's root. Set:

- `<!-- updated: YYYY-MM-DD -->` to today's date
- `## Current state` — the current state sentence(s) from Step 1
- `## Next` — the next line from Step 1

The `mcleod-sync` GitHub Action in Martina picks this up and updates `mcleod/projects/gardn/state.html` automatically.

## Step 6 — refresh mcleod/context/architecture.md (if needed)

If the session changed stack, schema, deployment, or any architectural fact captured in `mcleod/context/architecture.md`, update that file. If it didn't, skip — this file is the slow-churn architectural snapshot; not every session needs to touch it.

## Step 7 — commit in this repo

1. `git add mcleod/MCLEOD_STATE.md mcleod/CURRENT_SESSION.md mcleod/context/recent-sessions.md mcleod/docs/sessions/` (and any other session artefacts; do not use `git add -A`)
2. `git commit -m "session: end <date> <one-line summary>"`
3. `git push`

If "Promote to DECISIONS" is yes, also note it for the next Martina session where it can be added to `mcleod/projects/gardn/DECISIONS.md`.
