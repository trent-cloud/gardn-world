---
name: start-session
version: 2
description: Run the SESSION_START.md flow, produce the alignment check, surface orchestrator output, end with a single yes/no.
triggers:
  - "let's start"
  - "what's next"
  - "session opening"
  - "/start-session"
allowed-tools:
  - Read
  - Bash
reads:
  - state/SESSION_START.md
  - state/CLAUDE.md
  - state/CLAUDE.base.md
  - state/CURRENT_SESSION.md
  - state/MCLEOD_STATE.md
  - state/DECISIONS.md
  - state/BACKLOG.md
  - state/context/recent-sessions.md
  - state/ambition.md
writes: none
calls: "next intent decides (office-hours, ship, retro)"
---

# Skill: start-session

## Purpose

Codify the `SESSION_START.md` flow as a skill the resolver can route to. The reading list lives in `SESSION_START.md`; this skill is what fires after the read.

## Procedure

1. Read every file listed in `state/SESSION_START.md` (or the equivalent in non-martina repos). In order.
2. Surface any contradiction between what the user just said and what the files say. Don't silently follow either. Ask which wins.
3. **Surface what the orchestrator has produced** — see the "Surface what the orchestrator has produced" section in `state/SESSION_START.md`. For every open `auto-adjudicate` PR, state the adjudicator verdict AND your own read on the diff. For any failed or `awaiting_approval` `agent_runs` row, surface and judge. For any McLeod hub staleness banner firing, name the project. Silence on these looks like indifference; the judgement is the value.
4. Do NOT ask "anything changed in other projects?" — that's exactly what the orchestrator + mirror exist to make redundant. The data is in `project_state.project_updates`.
5. Produce the alignment check: one-sentence "where we are", bullet list of what works end-to-end, open tweaks if any, one recommended next action with estimated scope and external dependencies flagged.
6. End with a yes/no question on whether to proceed with the recommended action.

## Quality bar

- Alignment check is scannable in under 30 seconds.
- Recommended next action is one specific task, with rough scope, and any blocking external dependency named.
- Scope is confirmed before any build starts. Exception: if the request is unambiguous and small ("fix the typo on line 42"), just do it.
- Open auto-adjudicate PRs get a one-line operator-read (yours), not just the gpt-4o-mini verdict.

## Anti-patterns

- Asking "anything changed in Gardn/Orbit/etc.?" — the meta-layer's job, not Trent's.
- Restating scope as more than one sentence.
- Offering "multiple options to explore" instead of one recommendation.
- Beginning the alignment check with "Great question" or any preamble.
- Pulling stale items from `TRENT_TODO.md` (deprecated; see memory `trent-todo-deprecated`).
- Brushing over open capability PRs without stating your own quality read.
