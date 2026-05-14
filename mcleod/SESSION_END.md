# SESSION_END — Gardn

Run at the end of every Claude Code session in this project. Non-negotiable.

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
