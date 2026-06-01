---
name: learn
version: 1
description: Capture a durable, typed engineering learning so future tasks read it back. The write half of the learn loop — plan-review and review read these at the start of a task. Stores to state/learnings.jsonl via scripts/learnings.mjs.
triggers:
  - "/learn"
  - "log a learning"
  - "capture this lesson"
  - "remember this for next time"
  - "note this for future sessions"
  - "don't make this mistake again"
allowed-tools:
  - Bash
  - Read
reads:
  - state/learnings.jsonl (via `node scripts/learnings.mjs search`)
writes:
  - appends a learning to state/learnings.jsonl (via `node scripts/learnings.mjs add`)
calls: "read back by plan-review (Prior learnings step) and — once wired — review + start-session"
---

# Skill: learn

Adapted from GStack's `learn` loop (`bin/gstack-learnings-log` / `gstack-learnings-search`), 2026-06-01. Two deliberate divergences from GStack: learnings are **committed in-repo** at `state/learnings.jsonl` (not machine-local), and there is **no confidence decay** (a deliberate learning shouldn't erode just because time passed — that fights the locked-`DECISIONS.md` model).

## Purpose

Turn a lesson from this session into a durable, typed record the next task reads automatically. This is the **write** half of the loop; `plan-review` (and, once wired, `review` + `start-session`) are the **read** half. The point is to stop re-learning the same thing across 13 repos and many sessions.

## When to use — and when not

Log a learning when it is **durable**: it will matter in a future session or another repo. A pitfall in the mirror script, a pattern for how capabilities authenticate, a preference the operator stated about how reviews should run — all durable.

Do **not** log one-off trivia ("this typo was on line 42"). If it won't change a future decision, say "one-off, not logging" and move on.

**Boundary with auto-memory.** Martina also has Claude Code's file-based auto-memory. They don't overlap:
- **`state/learnings.jsonl`** (this skill) — per-project *engineering* learnings, typed and confidence-scored, read by skills mid-task (plan-review/review). "The mirror script's branch assumption breaks on non-`main` default branches."
- **Auto-memory** — facts about the operator, feedback, and project intent, recalled across *all* projects. "Trent prefers descope over kludge." Route user/feedback facts there, not here.

## Procedure

1. **Name the learning in one sentence.** Concrete and self-contained — it'll be read out of context months later. If you can't make it durable and specific, it's probably a one-off; don't log it.
2. **Classify it:**
   - **type** — one of: `pattern` (a reusable approach that worked), `pitfall` (a trap to avoid), `preference` (operator/estate taste), `architecture` (a structural fact), `tool` (how a tool/CLI behaves), `operational` (a process/run fact), `investigation` (a root cause found).
   - **source** — `observed` (you saw it happen), `user-stated` (the operator explicitly said it — sets `trusted: true`), `inferred` (you deduced it), `cross-model` (a second model surfaced it).
   - **confidence** — integer 1–10. Be honest: a one-time observation is ~5–6; a thing you've seen repeatedly or the operator stated is 8–10.
   - **key** — a short kebab-case slug naming what it's about (`mirror-branch-detection`, `wif-no-api-keys`). A newer entry with the same key+type supersedes the old one at read time.
3. **Write it:**
   ```bash
   node scripts/learnings.mjs add '{"type":"<type>","key":"<key>","insight":"<one or two sentences>","confidence":<1-10>,"source":"<source>"}'
   ```
   The helper validates the enums, rejects instruction-like (injection) content in the insight, stamps the timestamp, and appends. It prints the stored record.
4. **Confirm** the stored record back to the operator in one line.

## Quality bar

- Durable and specific. If a future session couldn't act on it, it doesn't belong here.
- Honest confidence and source — `user-stated` only when the operator actually said it.
- One learning per call. If a session produced three, log three with distinct keys.
- Never put a secret, token, or credential in the insight.

## Anti-patterns

- Logging one-off trivia or a victory lap. The store is for things that change future decisions.
- Inflating confidence to make a guess look certain. A 5 that's honest is more useful than a 9 that's wishful.
- Duplicating auto-memory's territory (operator/feedback/project facts) — route those to memory.
- Editing `state/learnings.jsonl` by hand. Always go through `scripts/learnings.mjs add` so validation and injection-stripping run.
