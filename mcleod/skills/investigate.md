---
name: investigate
version: 1
description: Root-cause debugging — gather evidence, form a hypothesis, verify, name the actual cause before any fix. No premature patching.
triggers:
  - "/investigate"
  - "why is this happening"
  - "debug this"
  - "what's causing"
  - "this is broken"
  - "regression"
  - "intermittent"
  - "flaky"
  - "going in circles"
allowed-tools:
  - Bash
  - Read
reads:
  - "relevant source files (named by user or inferred from symptom)"
  - "git log / blame on the suspect area"
  - "test output / error logs / browser console"
  - state/CLAUDE.md
  - "memory `going-in-circles-is-structural` if the user uses that framing"
writes:
  - investigation report (chat by default)
calls: "follow-up /review or direct edit when root cause is confirmed"
---

# Skill: investigate

Adapted from GStack's `/investigate`. Forces a root-cause pass before any fix. Especially valuable when symptoms recur or feel like "going in circles."

## Purpose

Stop the "patch the symptom" reflex. Force evidence-gathering, hypothesis formation, and verification before any code edit. The bar: name the actual cause in one sentence and cite the evidence before suggesting a fix.

## Procedure

1. **Restate the symptom precisely.** Pop-up the user's framing back to them. Make sure both sides agree on what's actually broken. "It doesn't work" is not a symptom — "X happens when Y, expected Z" is.

2. **Gather evidence.** Don't theorise yet.
   - Error message verbatim (full text + stack trace if any).
   - Reproduce steps (exact, deterministic if possible).
   - What changed recently? `git log --since="7 days ago" --name-only` on the suspect area.
   - When did it last work? Bisect mentally if not literally.
   - Any environmental difference (dev vs prod, machine vs CI, browser vs Node)?

3. **Form the hypothesis.** State it explicitly:
   > "Hypothesis: <one sentence about cause>. Evidence supporting: <a>, <b>. Evidence against: <c>."
   If "evidence against" is empty, you haven't looked hard enough — find at least one thing that *would* falsify the hypothesis.

4. **Verify the hypothesis.** Do the cheapest test that distinguishes the hypothesis from its alternatives. Examples:
   - Add a single log line, reproduce, read the log.
   - Comment out the suspect block, observe the symptom change.
   - Run the failing test with `--verbose` or in isolation.
   - Inspect the actual DB row vs the expected one.

5. **Name the root cause in one sentence.** If you can't, the hypothesis was wrong — back to step 3.

6. **Write the investigation report.** Format:

   ```
   ## Investigation: <one-line symptom>

   ### Root cause
   <one sentence>

   ### Evidence trail
   1. <what you observed>
   2. <what you ruled out>
   3. <what confirmed the cause>

   ### Proposed fix
   <one paragraph — what to change, why it addresses the root cause not the symptom>

   ### What else this might be hiding
   <one line — if any>
   ```

7. End with a yes/no question: "Apply the fix, or sit on the root cause and decide later?"

## Quality bar

- Root cause is one sentence. If it takes a paragraph, the hypothesis is still too broad.
- Every claim in the evidence trail is verifiable (file:line, log line, command output).
- "Proposed fix" addresses the cause, not the symptom. If the fix is "rerun it" or "add a retry," that's a symptom patch — go back to step 3.
- No code edits during this skill. Investigation only. Fixes follow the `/ship` or direct-edit path with operator approval.

## Anti-patterns

- Jumping to "let me try X" without evidence.
- "Probably a race condition" without proving it.
- Stack-traces-in-the-prompt as a substitute for actually reading the code that threw.
- Concluding "intermittent / flaky" — that's almost always a coverage gap in the investigation, not a real categorisation. Push harder.
- Suggesting a retry / wrap-in-try-catch as the fix when the cause is unidentified — that hides the symptom and the bug stays in.

## When to fire this skill

- Symptom has recurred. (Per memory `going-in-circles-is-structural`: when Trent says "going in circles", that's the signal to find the root cause, not patch individually.)
- The fix you're considering is "add a retry" or "wrap in try-catch."
- The bug is in code you didn't write (no mental model yet).
- The test passes but the symptom remains.
- The test fails but you can't reproduce locally.
