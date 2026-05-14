# Resolver

Intent → skill routing table. Loaded after session-start reading.

Canonical source: `mcleod/shared/RESOLVER.md` in `martina`. Mirrored read-only into every project repo by `scripts/mcleod-mirror.mjs`. Project-specific overrides are a Layer 2 concern; flag if needed, don't build inline.

## Behaviour

Hybrid matching:

- **Strict** for known intents (listed below) — load the named skill, fail loudly if missing.
- **Soft fallback** for unmatched intents — proceed without a skill, log the miss to `state/resolver-misses.md` (or the project-local equivalent under `mcleod/`) with date + verbatim user message for later calibration.

Match on intent signal, not exact wording. The signals below are seeds; obvious paraphrases count.

## Routing table

| Intent signal | Skill | Notes |
|---|---|---|
| "let's start", "what's next", session opening | `skills/start-session.md` | Also fires on Claude Code `/start-session` |
| "office hours", "I want to think through", "let's plan", "what should we build" | `skills/office-hours.md` | Borrowed pattern from GStack |
| "ship it", "let's ship", "open a PR", "merge this", end-of-feature | `skills/ship.md` | Pre-flight checks before commit |
| "retro", "what went well", "reflect on", end of session | `skills/retro.md` | Feeds future Skillify (Layer 3) |

Skill paths resolve to `state/skills/<name>.md` in martina and `mcleod/skills/<name>.md` in every other project repo. Either form refers to the same canonical file.

## Miss logging

When no strict match fires, append to `state/resolver-misses.md` (martina) or `mcleod/resolver-misses.md` (other repos):

```
- YYYY-MM-DD: "<verbatim user message>" — no skill matched
```

Trent reviews periodically; high-frequency misses become new skill entries.

## What this is not

- Not an eval rubric. No scoring, no fixtures. (Layer 2.)
- Not a planner. The skill itself decides the procedure; the resolver only chooses the skill.
- Not a replacement for `state/SESSION_START.md` or `state/CLAUDE.md`. Those still run; the resolver fires *after* the read, on user intent.
