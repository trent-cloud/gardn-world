# SESSION_START — Gardn

Read at the start of every Claude Code session in this project.

## Before you orient — sync local with origin

Run this first, every session:

```
git pull --ff-only && git status
```

If `git pull` fails on uncommitted local edits, `git stash`, pull, then `git stash pop`. If you're on a feature branch that can't fast-forward, you're working on a branch — orient on that branch and apply the branch-vs-main check at `SESSION_END.md` when you wrap.

Working tree should be clean or near-clean. Flag anything unexpected — particularly stale root-level files (`MCLEOD_STATE.md`, `SESSION_START.md` etc. at root) that should have been deleted by the 2026-05-14 cleanup; if they reappear, something pushed them back and we need to investigate.

Note any commits the pull brought in — often canonical files mirrored from martina via `mcleod-mirror`. If you don't recognise a recent commit, read its diff before continuing.

## Orient yourself

Read these from the `mcleod/` folder at the repo root in order:

1. `mcleod/CLAUDE.md` — project-specific rules (imports `mcleod/CLAUDE.base.md`)
2. `mcleod/CLAUDE.base.md` — universal estate-wide rules
3. `mcleod/ambition.md` — what this project is (pitch, ambition, Claude's role, strategic bet, what would kill it)
4. `mcleod/CURRENT_SESSION.md` — the latest end-session block (where things were left)
5. `mcleod/MCLEOD_STATE.md` — one-paragraph current state
6. `mcleod/DECISIONS.md` — locked decisions for this project
7. `mcleod/BACKLOG.md` — active items (if present)
8. `mcleod/context/recent-sessions.md` — the last three session blocks (narrative history)
9. `mcleod/context/domain.md` — who the project serves and what it's for
10. `mcleod/context/architecture.md` — stack, key data model, key flows
11. `mcleod/RESOLVER.md` — intent → skill routing table; applied for the rest of the session

After the reading is complete, apply `mcleod/RESOLVER.md` as additive routing — it doesn't change the steps above. It maps specific user intents (start-session, office-hours, brainstorm-post, ship, retro) to skill files under `mcleod/skills/`. Unmatched intents append to `mcleod/resolver-misses.md` for later calibration.

If anything in those files contradicts what Trent (or Richard) just asked for, **flag the contradiction explicitly**. Don't silently follow the request. Don't silently follow the file. Ask which wins.

## Confirm scope

Restate in one sentence what you understand the session is for. Wait for confirmation before starting work.

Exception: if the request is unambiguous and small, just do it.

## Default behaviours

- British English.
- No `git add -A`.
- Claude co-author trailer on every commit.
- Four irreversibles get gated with consequences shown. Everything else auto-allow.
- Don't initiate session wrap-ups.
- Don't preamble artefacts.
- End turns with a yes/no question.

## When in doubt

Ask one question. Don't guess.
