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
| "let's start", "what's next", session opening, `/start-session` | `skills/start-session.md` | v2 (2026-05-22) — no longer asks "anything changed in other projects?"; surfaces open auto-adjudicate PRs with operator-read instead. |
| "office hours", "I want to think through", "let's plan", "what should we build" | `skills/office-hours.md` | Borrowed pattern from GStack |
| `/plan-review`, "review this plan", "review my approach", "before I build", "is this plan sound", "sanity-check the approach" | `skills/plan-review.md` | Adapted from GStack `plan-eng-review` + `autoplan`'s 6 Decision Principles (2026-06-01). Reviews the PLAN before code: eng lens + auto-decide Mechanical/Taste, never auto-override a User Challenge. Flow: office-hours → plan-review → build → review → ship. |
| "ship it", "let's ship", "open a PR", "merge this", end-of-feature | `skills/ship.md` | Pre-flight checks before commit |
| "retro", "what went well", "reflect on", end of session | `skills/retro.md` | Feeds future Skillify (Layer 3). v3 (2026-06-01) adds **estate mode** (`/retro estate`, "cross-repo retro", "what shipped across the estate") — cross-repo retrospective reading live `project_state` via `scripts/estate-state-read.mjs`; degrades if the orchestrator DB key is absent. Adapted from GStack `/retro global`. |
| "agent in Xero", "bank rec", "reconcile in Xero", "bills agent", "card spend in Xero", "Xero scope", "Xero API", any planning conversation about an agent reading from or writing to Xero | `skills/xero-integration.md` | Martina-specific. Load before designing or modifying any Xero-touching capability. Captures verified API-surface map + push-from-source mental model + anti-patterns from the 2026-05-18 bank-rec discovery session. |
| `/review`, "review this", "code review", "review the diff" | `skills/review.md` | Adapted from GStack 2026-05-22. Staff-engineer review on the current diff — auto-fix obvious, flag the rest. |
| `/cso`, "security review", "OWASP review", "STRIDE", "threat model" | `skills/cso.md` | Adapted from GStack 2026-05-22. OWASP Top 10 + STRIDE pass; the most-cited "real finding" GStack skill. Run quarterly on business-critical repos. |
| `/investigate`, "why is this happening", "debug this", "regression", "intermittent", "going in circles" | `skills/investigate.md` | Adapted from GStack 2026-05-22. Root-cause-before-fix protocol. Fires when "going in circles" — see memory of same name. |
| `/learn`, "log a learning", "capture this lesson", "remember this for next time", "don't make this mistake again" | `skills/learn.md` | Adapted from GStack `learn` (2026-06-01). Write half of the learn loop — typed, confidence-scored learnings to `state/learnings.jsonl` via `scripts/learnings.mjs`. No confidence decay (fights locked DECISIONS); committed in-repo, not machine-local. Read back by `plan-review`. Distinct from auto-memory (operator/feedback facts go there). |

Skill paths resolve to `state/skills/<name>.md` in martina and `mcleod/skills/<name>.md` in every other project repo. Either form refers to the same canonical file.

## Skill file format (v2, adopted 2026-05-22)

All skills now use GStack-style YAML frontmatter — `name`, `version`, `description`, `triggers`, `allowed-tools`, `reads`, `writes`, `calls` — above the markdown body. The frontmatter is the authoritative trigger declaration; the routing table above is a human-readable summary that should match. If they diverge, the frontmatter wins; update the table.

No binary preamble dependency. Where GStack's skills shell out to a compiled Bun binary for context-loading and telemetry, martina's skills are pure markdown — they degrade gracefully on machines without GStack installed.

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
