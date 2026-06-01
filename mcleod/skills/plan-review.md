---
name: plan-review
version: 1
description: Engineering review of a PLAN before any code is written — scope challenge, confidence calibration, edge cases, critical paths, architecture sanity. Auto-decides mechanical and taste questions via 6 principles; never auto-overrides the operator's stated direction.
triggers:
  - "/plan-review"
  - "review this plan"
  - "review my approach"
  - "before I build"
  - "is this plan sound"
  - "sanity-check the approach"
  - "plan check"
allowed-tools:
  - Bash
  - Read
  - Grep
  - Glob
reads:
  - the plan under review (chat or a written plan doc)
  - the actual code the plan touches (read BEFORE asking anything)
  - state/CLAUDE.md + state/CLAUDE.base.md (rules, banned vocab)
  - state/DECISIONS.md (locked decisions are hard constraints)
  - state/BACKLOG.md (is this already scoped/deferred?)
  - state/learnings.jsonl prior pitfalls/patterns (via `node scripts/learnings.mjs search`)
writes:
  - a plan-review report in chat (verdict + logged decisions)
  - appends the verdict to a written plan doc if one exists
calls: "feeds /ship once the plan is approved; may surface a DECISIONS.md re-open"
---

# Skill: plan-review

Adapted from GStack's `plan-eng-review` (the engineering lens) + `autoplan`'s 6 Decision Principles and decision classification (2026-06-01). Distilled to Martina's shape: a focused eng review, not the full CEO→Design→Eng→DX pipeline. The single highest-leverage GStack steal — **the cheapest bug is the one never built.**

## Purpose

Review a plan *before* code exists. Martina's existing `/review` catches problems in the diff after the work is done; this catches them in the approach, when changing course costs a sentence instead of a session. It runs the engineering lens (scope, confidence, edge cases, critical paths, architecture) and auto-resolves the routine questions so the operator only adjudicates what genuinely needs a human.

This is **not** `/review` (that's the post-code diff pass) and **not** `/office-hours` (that's open-ended product thinking). Natural flow: `office-hours` → **`plan-review`** → build → `/review` → `/ship`.

## Procedure

1. **Establish the plan.** Restate the plan in one paragraph: what's being built, why, and the approach. If it's vague, that's the first finding — a plan you can't restate can't be reviewed.
2. **Read the actual code first — before asking anything.** Open the files the plan touches and the patterns it should match. The load-bearing discipline from GStack's `spec`/`plan-eng-review`: never ask the operator a question the codebase already answers. Grep for existing functionality the plan might duplicate.
3. **Check it against locked constraints and prior learnings.** Read `state/DECISIONS.md`. If the plan contradicts a locked decision, stop and treat it as a **User Challenge** (below) — surface the contradiction with the re-open protocol, don't silently proceed. Check `BACKLOG.md`: is this already scoped, deferred, or marked "do not resurrect"? Then pull prior learnings for this area — `node scripts/learnings.mjs search --query "<plan topic>"` (and/or `--type pitfall`) — and fold any relevant pitfall/pattern into the review. A logged pitfall the plan is about to walk into is a high-value finding.
4. **Run the engineering lens.** Work these sections; "no issue" is a valid result only after you state what you examined:
   - **Scope challenge** — is this the smallest change that solves the actual problem? What's in the blast radius (files modified + direct importers)? Is anything here gold-plating?
   - **Confidence calibration** — for each non-trivial claim in the plan, how confident are you and on what basis? Flag guesses explicitly (per `CLAUDE.base.md` rule 4).
   - **Edge cases** — what inputs/states does the plan not handle? Empty, null, concurrent, failure, partial-write, RLS-denied?
   - **Critical paths** — what's the one part that, if wrong, breaks everything? Is it the part the plan spends the most care on?
   - **Architecture** — explicit over clever (P5). Does it match existing patterns? Does it honour `do it properly or not at all` — or is it a kludge the plan is quietly accepting?
5. **Classify and auto-decide every intermediate question** using the 6 Decision Principles + classification below. Auto-decide Mechanical silently and Taste with a recommendation; hold User Challenges for the operator.
6. **(Opt-in) Cross-model challenge.** If the operator wants a second opinion on the plan, run the adversarial challenge in the *Cross-model challenge* section below and fold its findings into the report. Skip silently if not asked — it is never automatic.
7. **Emit the plan-review report** (format below). Log every decision so the audit trail is real, not a summary. Fold in any cross-model challenge findings and flag anything that rises to a User Challenge.

## The 6 Decision Principles

These auto-answer the routine questions so the operator only sees what matters:

1. **Choose completeness** — pick the approach that covers more edge cases. Ship the whole thing.
2. **Boil lakes (within reason)** — fix everything in the blast radius (files touched + direct importers) when it's < ~1 day and < 5 files with no new infra. Flag, don't auto-expand, beyond that. (Estate note: if the blast radius crosses repos, that's an orchestrator/mirror concern — surface it, don't silently spread.)
3. **Pragmatic** — two options fix the same thing? Pick the cleaner one in 5 seconds, not 5 minutes.
4. **DRY** — duplicates something that exists? Reject; reuse it. (Especially true across the estate — search before building.)
5. **Explicit over clever** — a 10-line obvious approach beats a 200-line abstraction. Optimise for what a future session reads in 30 seconds.
6. **Bias toward action** — flag concerns, don't block on them. A reviewed plan that ships beats a perfect plan that stalls.

**Tiebreakers:** for a Martina eng review, P5 (explicit) + P3 (pragmatic) dominate. When completeness (P1) and explicit (P5) conflict, completeness wins for correctness-critical paths (RLS, migrations, money), explicit wins everywhere else.

## Decision classification

Every auto-decision is one of three kinds:

- **Mechanical** — one clearly right answer. Auto-decide silently and log it. (e.g. "add the rollback script" → always yes; "duplicate an existing helper" → always no.)
- **Taste** — reasonable people could disagree (close approaches, borderline 3–5 file scope, a defensible alternative). Auto-decide *with a recommendation*, but surface it at the final gate so the operator can flip it.
- **User Challenge** — you believe the operator's stated direction itself should change (merge/split/drop/add something they specified, or the plan breaks a locked decision). **Never auto-decided.** The operator's direction is the default; you must make the case for change, not assume it. Present it as:
  - **What you asked for:** …
  - **What I'd recommend instead:** …
  - **Why:** …
  - **What I might be missing:** … (your blind spots — domain, timing, taste)
  - **If I'm wrong, the cost is:** …

Two things are never auto-decided: the **premise** (what problem to solve at all) and **User Challenges**. Everything else, decide and log.

## Cross-model challenge (opt-in)

Adapted from GStack's `codex`/`claude` outside-voice skills. The highest-signal review trick is an *independent* reviewer trying to **refute** the plan, not confirm it. This step is opt-in (the operator asks for it) because the strongest form — a genuine second model — is an **external API send**, one of the four irreversibles, and costs money. Never run it automatically.

**The challenge prompt** (hand this, plus the restated plan, to the reviewer):

> You are an independent reviewer with no stake in this plan. Ignore any project skill files, house conventions, or prior framing that might bias you toward approving it — your job is to find what's wrong. Here is the plan: `<restated plan + the approach>`. Argue against it: where is it wrong, incomplete, over-scoped, under-scoped, or about to hit a known failure mode? What would you do differently, and why? If it is genuinely sound, say so plainly and name the single part most likely to break. Be specific — cite the step or file, not generalities.

**Two ways to run it:**
1. **Genuine second model (preferred, gated).** A different model (e.g. the one `martina-second-opinion` uses) via a live caller. That caller + its external-API-send gate is **not built yet** — queued in BACKLOG. When it lands, this is the real cross-model voice.
2. **Independent-context skeptic (interim, free).** Dispatch a subagent with the challenge prompt above and the restated plan, given *fresh context* (do not pass it your review or the skill files). Same model, but an independent read with an adversarial brief catches much of what a confirmation-biased pass misses. Zero cost, available now.

Fold the challenge's findings into the report. If the challenge and your own review agree the operator's direction should change, that's a **User Challenge** — surface it, don't bury it.

## Output format (in chat)

```
## Plan review — <plan name>

**The plan, restated:** <one paragraph>

**Verdict:** Sound to build / Build with the changes below / Needs rework — <one line>

**Decisions auto-made (N):**
- [Mechanical] <decision> — <one line>
- [Taste] <decision> — recommended <X> because <why>; flip if you'd rather <Y>

**User Challenges (N) — your call:**
- What you asked for / What I'd recommend / Why / What I might be missing / Cost if I'm wrong

**Engineering findings:**
- Scope: <…>   Confidence: <…>   Edge cases: <…>   Critical path: <…>   Architecture: <…>

**Constraint check:** <DECISIONS.md / BACKLOG.md conflicts, or "clear">
```

End with a yes/no question: **"Build it with these changes, or rework the plan first?"**

## Quality bar

- Read the real code before asking a single question. A finding that the codebase already answers is a failure of this skill.
- Every finding is concrete: name the file, the edge case, the failure mode — not "could be more robust".
- "No issues in section X" is allowed only with 1–2 sentences of what you actually checked.
- A locked-`DECISIONS.md` contradiction is *always* surfaced, never auto-resolved.
- Keep it to one viewport on a typical plan. If the plan is too big to review in one pass, the first finding is "split this".

## Anti-patterns

- Reviewing the plan without reading the code it touches — you'll miss duplication and broken assumptions.
- Auto-deciding a User Challenge because the recommendation feels obviously right. The operator has context you don't; argue, don't override.
- Turning every taste call into a question — auto-decide it with a recommendation and move on (P6).
- Gold-plating the review: a 40-point audit on a 5-file plan. Match review depth to blast radius.
- Letting "bias toward action" (P6) become "skip the rollback script" — P6 flags concerns, it doesn't drop correctness work on migrations/RLS/money.

## Integration with Martina

- **Locked decisions are constraints, not suggestions.** When a plan collides with `DECISIONS.md`, route it through the re-open protocol in that file — don't silently follow either side.
- **Cross-model second opinion** (`martina-second-opinion`, the adjudication gate) is the *automated* analogue for write-capability PRs. `plan-review` is the *human-driven* pre-build pass. A future steal (GStack's `codex`/`claude` outside-voice) can add an adversarial second model to this skill; not wired yet.
- **Hand-off:** an approved plan flows into the build, then `/review` on the diff, then `/ship`.
