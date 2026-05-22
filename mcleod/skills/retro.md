---
name: retro
version: 2
description: End-of-session reflection — three questions, append a Retro block to today's session log, log Skillify candidates.
triggers:
  - "retro"
  - "what went well"
  - "reflect on"
  - "end of session"
allowed-tools:
  - Read
  - Edit
  - Bash
reads:
  - state/sessions/YYYY-MM-DD.md (if it exists)
  - state/CURRENT_SESSION.md
  - "session commit log"
writes:
  - "appends ## Retro block to state/sessions/YYYY-MM-DD.md"
calls: "feeds Skillify (Layer 3, deferred) — does not invoke it directly"
---

# Skill: retro

## Purpose

End-of-session reflection. Capture what worked, what didn't, and the patterns that — if formalised — would prevent re-litigation next session. The retro is the input feed for Skillify, which will eventually turn high-frequency patterns into new skills or update existing ones.

## Procedure

1. Skim the session log (commits, files changed, decisions reached). Note the actual arc, not the planned one.
2. Ask three questions, one at a time, pop-up format where the answer is bounded:
   - **What worked?** Free text. Specific moments, not "everything went well".
   - **What didn't?** Free text. Specific friction, not "more clarity needed".
   - **What would a permanent fix look like?** Pop-up format with: *new skill* / *update existing skill* / *update CLAUDE.md rule* / *nothing — one-off* / *not sure yet*.
3. Write the block:

   ```markdown
   ## Retro

   ### What worked
   - <bullet>

   ### What didn't
   - <bullet>

   ### Skillify candidates
   - <pattern> → <new skill | update <skill> | new CLAUDE.md rule | none>
   ```

4. End with a yes/no question: "Flag any of these to BACKLOG for action, or leave them in the retro?"

## Quality bar

- At least one specific moment named under "what worked" and "what didn't" — not generic ("communication was great"). If the session was genuinely smooth, say so plainly in one line and move on.
- Skillify candidates section either names a candidate or says "none this session" explicitly.

## Anti-patterns

- Retroactively rewriting what happened to look better than it was.
- Skipping "what didn't" because it feels uncharitable. The point of the retro is exactly this section.
- Auto-creating new skills from the retro. That's Layer 3's job; for now, just log the candidate.
- Letting the retro become its own session — keep it under 5 minutes of conversation.
