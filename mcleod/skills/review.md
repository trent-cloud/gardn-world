---
name: review
version: 1
description: Staff-engineer code review on the current diff — correctness bugs, edge cases, performance pitfalls, security smells, idiomatic concerns. Fixes obvious issues inline; flags larger ones.
triggers:
  - "/review"
  - "review this"
  - "code review"
  - "review the diff"
  - "review the change"
  - "look over this"
allowed-tools:
  - Bash
  - Read
  - Edit
reads:
  - git diff (current branch vs main, or staged vs HEAD)
  - relevant test files
  - state/CLAUDE.md (project-specific rules)
  - state/CLAUDE.base.md (universal rules)
writes:
  - inline edits for obvious fixes
  - a review summary at the end with severity-tagged findings
calls: "may surface a follow-up /ship if review passes"
---

# Skill: review

Adapted from GStack's `/review`. Staff-engineer code review pass on the current diff. Lowest-risk, highest-frequency skill to install — works on every codebase, every session.

## Purpose

A pre-ship review pass that catches what tests don't: correctness bugs, edge cases, unhandled async failures, security smells, idiom violations, performance pitfalls. Auto-fixes the obvious; flags the rest for discussion.

## Procedure

1. **Determine the diff scope.** Default: `git diff main...HEAD` (branch vs main). If on main with uncommitted edits: `git diff HEAD`. If staged: `git diff --staged`. Confirm with the user if ambiguous.
2. **Read the project rules.** `state/CLAUDE.md` + `state/CLAUDE.base.md` (or per-project equivalents). The review uses the project's banned vocabulary, decision constraints, and architectural guarantees as the gauge.
3. **Walk the diff file by file.** For each changed file:
   - Does the change do what the commit message says it does?
   - Are there edge cases the test suite doesn't cover?
   - Any unhandled promise rejection, missing await, race condition, off-by-one, null/undefined trap?
   - Security smells: unescaped user input, secrets in code, OAuth tokens in browser-reachable scope, missing RLS guard, SQL string concat?
   - Performance: N+1, unbounded loops, blocking I/O on main thread, missing indexes?
   - Idiom: does this match the codebase's existing patterns? Does it violate `do it properly or not at all`?
4. **Tier the findings.**
   - **Auto-fix:** typos, obvious bugs with deterministic fix, banned-vocab swaps, formatting (only if user agrees first).
   - **Flag:** larger architectural concerns, security questions, design choices that warrant operator decision.
5. **Write the review summary** in chat (don't write a file — the diff itself is the persistent surface). Format:

   ```
   ## Review summary

   **Auto-fixed (N):**
   - <file:line> — <one-line>

   **High-severity flags (N):**
   - <file:line> — <one-line problem> → <suggested action>

   **Medium-severity flags (N):**
   - <file:line> — <one-line>

   **Style / nit (N):**
   - <file:line> — <one-line>
   ```

6. End with a yes/no question: "Address high-severity flags now, or ship as-is?"

## Quality bar

- Every finding cites file:line.
- Auto-fixes are confirmed with the user before applying unless trivially obvious (typo, missing semicolon).
- High-severity findings explain the failure mode in concrete terms — not "could be improved."
- Review under 10 minutes on a typical PR (~5-10 file changes). If the diff is larger, suggest splitting before reviewing.

## Anti-patterns

- Reviewing the WHOLE codebase. Scope is the diff.
- Reviewing without reading `CLAUDE.md` — you'll miss project-specific banned vocab and architectural constraints.
- "Looks good to me" without specifics. If there's nothing wrong, say so explicitly and name three things you actually checked.
- Auto-fixing without the operator's nod on anything beyond pure typos.
- Generic OWASP-style noise. If you flag a security concern, it must be present in this diff, not a general best-practice lecture.

## Integration with `martina-second-opinion`

This skill is the **human-driven** review pass. For auto-merge capabilities (cross-pollinate, writeback-backlog) the `martina-second-opinion` workflow does the gpt-4o-mini adjudication. Both can flag findings; the operator decides. If `/review` and the adjudicator disagree, the operator's call wins.
