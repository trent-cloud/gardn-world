# SESSION_END — gardn

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

## Step 2 — write CURRENT_SESSION.md at the repo root

Overwrite `CURRENT_SESSION.md` at this repo's root with the session block from Step 1. Replace any previous content entirely — only the latest session belongs here. This is what Claude.ai reads when Trent or Richard starts a brainstorm; it must never contain stale or appended history.

Also write a dated archive copy to `docs/sessions/YYYY-MM-DD.md` so the full session history is preserved off the read path.

## Step 3 — update MCLEOD_STATE.md in this repo

Edit `MCLEOD_STATE.md` at this project's root (copy from `mcleod/shared/MCLEOD_STATE.template.md`
if it does not exist yet). Set:

- `<!-- updated: YYYY-MM-DD -->` to today's date
- `## Current state` — the current state sentence(s) from Step 1
- `## Next` — the next line from Step 1

The `mcleod-sync` GitHub Action in Martina picks this up daily at 06:00 UTC and
updates `mcleod/projects/gardn/state.html` automatically. No manual Martina
session required.

## Step 4 — commit in this repo

1. `git add MCLEOD_STATE.md` (and any other session artefacts)
2. `git commit -m "session: end <date> <one-line summary>"`
3. `git push`

If "Promote to DECISIONS" is yes, also note it for the next Martina session where it can
be added to `mcleod/projects/gardn/DECISIONS.md`.
