---
name: ship
version: 2
description: Pre-PR checklist — branch clean, tests passing, migrations reversible, four-irreversibles gate honoured, commit hygiene.
triggers:
  - "ship it"
  - "let's ship"
  - "open a PR"
  - "merge this"
  - "end of feature"
allowed-tools:
  - Bash
  - Read
  - Edit
reads:
  - git status / git diff
  - test output
  - migration files in the current change
  - state/CLAUDE.md
  - state/CLAUDE.base.md
writes:
  - commits (one per logical change), optionally a PR
calls: "project's test runner, linter, migration verification script if present"
---

# Skill: ship

## Purpose

Pre-PR checklist. Stop "I'll just push it" from becoming a half-broken main. The four-irreversibles gate is non-negotiable; everything else is fast.

## Procedure

Run through this list. Any "no" branches to a pop-up: **proceed / fix / cancel**.

1. **Branch clean?** No untracked work that should be staged but isn't; no staged work that doesn't belong in this PR.
2. **Tests passing?** Run the relevant suite. If there's no suite, say so explicitly — don't pretend "manual testing only" is the same.
3. **Migrations reversible?** If the change touches schema:
   - Reversible? (nullable column, additive only, no data loss path.)
   - Tested against a copy of production or a local snapshot?
   - Rollback script written?
4. **Four-irreversibles gate fired where it should?** Migration, production deploy, force-push, external API send — each one requires the consequence-prompt per `state/CLAUDE.base.md`. If you're about to do one, show the prompt; don't just "press 1" because it's reflex.
5. **Commit hygiene.** One logical unit per commit. No `git add -A`. Co-author trailer present:
   ```
   Co-Authored-By: Claude <noreply@anthropic.com>
   ```
6. **PR (only if asked).** Default is *don't* open a PR unless the user explicitly said so. Push the branch; let the user decide.

End with a yes/no question: "Push and open the PR, or hold?"

## Quality bar

- Every check answered out loud. No silent skips.
- If any check fails, the pop-up fires before any irreversible action.
- Commit messages describe what changed and why, not "various fixes".

## Anti-patterns

- `--no-verify`. If the hook fails, fix the underlying issue.
- `--amend` on a published commit. Create a new commit instead.
- Force-push to main or any shared branch. Stop and ask.
- "I'll add the test later." Either the test ships with the change or the change is descoped.
- `git add -A` to "save time". The cost of accidentally committing a secret is much higher than the cost of typing paths.
