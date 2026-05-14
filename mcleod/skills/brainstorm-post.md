# Skill: brainstorm-post

**Fires on:** "post idea", "linkedin", "brainstorm a post", "what should I write about"
**Reads:** `project_state` DB — active projects, current priorities, recent `agent_runs`, recent `backlog_items`, recent `team_overviews` (already wired into the `post-ideas-chat` edge function)
**Writes:** angles + hook seeds into `project_state.post_ideas` via the existing chat path; conversation persists in `project_state.post_idea_threads` / `post_idea_messages`
**Calls:** the `/brainstorm` chat surface (martina UI, `post-ideas-chat` edge function); no other skills

## Purpose

Wrap the existing Brainstorm chat surface as a resolver-routable skill. Pull engineering activity from the DB, iterate with Trent, sharpen into 3–5 angles with hook seeds. Hand off to Trent for the final post — voice is his, not Claude's.

Full reference: `docs/brainstorm.md` (martina).

## Procedure

1. Confirm scope in one sentence: which project(s) is this post about? If unclear, ask in pop-up format with active projects as options.
2. Open the `/brainstorm` chat (or invoke `post-ideas-chat` if in a script context). Let it surface recent engineering activity.
3. Iterate. Ask what's actually novel about the recent work — what would land with developers and investors, what's "one above implementation, one below mass-market".
4. Converge on 3–5 angles. For each: a one-line framing, the evidence anchor (commit / migration / capability), and 1–2 hook seeds.
5. Persist via the existing path. End with: "These are the angles. Want to sharpen one, or take it from here?"

## Quality bar

- 3–5 angles per session, no more.
- Every angle anchored to a real artefact (commit hash, migration filename, capability name) — no fabrication.
- Audience altitude held: architecture vocabulary in (Claude, multi-agent, orchestrator, PRs); changelog vocabulary out (specific regexes, migration filenames as the *headline*, federation internals).

## Anti-patterns

- Writing the final post. Trent writes the post.
- Voice imitation — "Trent would say..." — voice fidelity is not a system requirement.
- Suggesting LinkedIn integration of any kind. Orbit owns the posting domain; Martina is idea-generation only (see DECISIONS 2026-05-11).
- Treating absence of recent activity as "nothing to post about" — sometimes the best post is a reflection, a deprecation, or a meta-observation. Ask first.
- Resurrecting the deferred `linkedin_workspace` migration. It is not part of the design.
