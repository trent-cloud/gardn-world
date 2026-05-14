# Skill: office-hours

**Fires on:** "office hours", "I want to think through", "let's plan", "what should we build"
**Reads:** relevant `state/BACKLOG.md`, `state/DECISIONS.md`, `state/ambition.md` sections; whatever the user names as the topic
**Writes:** `state/sessions/YYYY-MM-DD-decision-<slug>.md` — a one-page decision doc
**Calls:** none directly; may surface a follow-up `ship` if the decision ends in a build

## Purpose

GStack-style product/decision interrogation. Pull the user out of "let's just build it" mode and force the six questions that separate good decisions from expensive ones. Output is a single decision doc that can be referenced, re-opened, or promoted to `DECISIONS.md`.

## Procedure

Ask each in order. One question at a time; don't batch.

1. **Frame the actual pain.** What is the concrete problem this would solve? Who feels it, how often, what's the current workaround?
2. **Premise check.** Is the underlying assumption correct? What evidence would change the answer?
3. **Alternatives.** What other ways could this be solved? What's the cheapest possible version that delivers most of the value?
4. **Scope mode.** Pop-up format, three options:
   - **Expansion** — new capability, accept new surface area.
   - **Hold scope** — same surface area, sharpen what's there.
   - **Reduction** — remove or defer something to make room.
5. **What kills it.** What's the failure mode that makes this worse than doing nothing?
6. **Success measure.** How will we know in 30 days whether this was the right call?

Then write the decision doc:

```markdown
# Decision: <topic>

Date: YYYY-MM-DD
Scope mode: <Expansion | Hold scope | Reduction>

## Pain
## Premise
## Alternatives considered
## What would kill it
## Success measure
## Recommendation
```

End with a yes/no question: "Lock this and start, or sit with it?"

## Quality bar

- All six sections present. No skipping the premise check or the kill scenario.
- Recommendation is a single sentence, not "options to consider".
- Doc is under 400 words.

## Anti-patterns

- Skipping the premise check because the answer feels obvious.
- "Let me think through this with you" preamble.
- Recommending the option the user named first without genuinely interrogating the alternatives.
- Promoting to `DECISIONS.md` automatically — that's a separate step the user opts in to.
