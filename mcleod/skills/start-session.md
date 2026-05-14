# Skill: start-session

**Fires on:** "let's start", "what's next", session opening, Claude Code `/start-session`
**Reads:** `state/SESSION_START.md`, then the full reading list it names (`CLAUDE.md`, `CLAUDE.base.md`, `CURRENT_SESSION.md`, `MCLEOD_STATE.md`, `DECISIONS.md`, `BACKLOG.md`, `ambition.md` where present)
**Writes:** nothing
**Calls:** no other skills; subsequent intent decides

## Purpose

Codify the existing `SESSION_START.md` flow as a skill so the resolver can route to it cleanly. This skill does not replace `SESSION_START.md` — it is what fires after the read, on user intent. The reading list itself stays under `CLAUDE.md` control.

## Procedure

1. Read every file listed in `state/SESSION_START.md` (or the equivalent in non-martina repos). In order.
2. Surface any contradiction between what the user just said and what the files say. Don't silently follow either. Ask which wins, in pop-up format.
3. Ask the McLeod-update question: *"Anything changed in Gardn, Orbit, Woodlark, Studio Woodlark, or Verified3PL since the last session that I should update in McLeod?"* — pop-up format with Yes / No.
4. If yes, take the update via interactive McLeod annotation or by editing `state/MCLEOD_STATE.md` in the relevant project.
5. Produce the alignment check: one-sentence "where we are", bullet list of what works end-to-end, open tweaks if any, one recommended next action with estimated scope and external dependencies flagged.
6. End with a yes/no question on whether to proceed with the recommended action.

## Quality bar

- Alignment check is scannable in under 30 seconds.
- Recommended next action is one specific task, with rough scope, and any blocking external dependency named.
- Scope is confirmed before any build starts. Exception: if the request is unambiguous and small ("fix the typo on line 42"), just do it.

## Anti-patterns

- Skipping the McLeod-update prompt.
- Restating scope as more than one sentence.
- Offering "multiple options to explore" instead of one recommendation.
- Beginning the alignment check with "Great question" or any preamble.
- Pulling stale items from `TRENT_TODO.md` (deprecated; see memory `trent-todo-deprecated`).
