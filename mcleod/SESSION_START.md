# SESSION_START — gardn

Read at the start of every Claude Code session in this project.

## Orient yourself

Read these from the `mcleod/` folder at the repo root in order:

1. `mcleod/CLAUDE.md` — codebase-specific rules (imports `mcleod/CLAUDE.base.md`)
2. `mcleod/CLAUDE.base.md` — universal estate-wide rules
3. `mcleod/CURRENT_SESSION.md` — the latest end-session block (where things were left)
4. `mcleod/MCLEOD_STATE.md` — one-paragraph current state
5. `mcleod/DECISIONS.md` — locked decisions for this project
6. `mcleod/BACKLOG.md` — active items (if present)

If anything in those files contradicts what Trent (or Richard) just asked for, **flag the contradiction explicitly**. Don't silently follow the request. Don't silently follow the file. Ask which wins.

## Confirm scope

Restate in one sentence what you understand the session is for. Wait for confirmation before starting work.

Exception: if the request is unambiguous and small ("fix the typo on line 42"), just do it.

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
