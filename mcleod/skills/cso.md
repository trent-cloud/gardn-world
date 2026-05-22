---
name: cso
version: 1
description: Security review — OWASP Top 10 + STRIDE threat model against the current codebase or diff. One credible catch pays for the install.
triggers:
  - "/cso"
  - "security review"
  - "security audit"
  - "OWASP review"
  - "STRIDE"
  - "threat model"
  - "is this secure"
  - "any security issues"
allowed-tools:
  - Bash
  - Read
  - Edit
reads:
  - git diff (if diff-scoped) OR repo structure (if full audit)
  - state/CLAUDE.md (project-specific security rules)
  - state/CLAUDE.base.md (estate security rules)
  - relevant migrations (for RLS / schema checks)
  - integration_tokens / auth-touching code
writes:
  - security findings report (in chat by default; user can ask for file write)
calls: "may suggest a follow-up /review on the proposed fix"
---

# Skill: cso

Adapted from GStack's `/cso` — the most-cited "real finding" skill in the GStack ecosystem (XSS catch on a maintained codebase is the canonical anecdote). Lowest-effort credible-catch surface available. Run on each business-critical repo at least quarterly.

## Purpose

Chief Security Officer pass. Reviews code against OWASP Top 10 + STRIDE threat model and flags concrete vulnerabilities found in the current artefact. The bar: every finding must cite file:line and a specific exploit path, not generic best-practice lectures.

## Procedure

1. **Scope.** Pop-up to confirm:
   - **Diff-only** — review only the current branch's changes (fastest, narrowest).
   - **Recent-touch** — files modified in the last 30 days.
   - **Full repo** — every file (slower, broadest).

2. **Project context.** Read `state/CLAUDE.md` + `state/CLAUDE.base.md`. Note the four irreversibles, the RLS-at-DB-level rule, the no-OAuth-tokens-in-browser rule. These are the load-bearing security guarantees of the estate.

3. **OWASP Top 10 walk.** For each category, scan for evidence:
   - **A01 — Broken Access Control.** Missing RLS policy on a `public.*` table? Endpoint that doesn't check ownership? PA role with access to a finance table?
   - **A02 — Cryptographic Failures.** Plaintext OAuth token storage? Weak password hashing? Missing TLS enforcement?
   - **A03 — Injection.** SQL string concat? Unparameterised query? `dangerouslySetInnerHTML` with user content?
   - **A04 — Insecure Design.** Trust boundary violations (e.g. RLS bypass via service role exposed to client)?
   - **A05 — Security Misconfiguration.** Edge functions deploying without `--no-verify-jwt`? CORS over-permissive? Default service-role keys committed?
   - **A06 — Vulnerable Components.** Old SDK version with known CVE? `npm audit` output?
   - **A07 — Identification + Authentication Failures.** Session timeout absent? MFA bypass? Auth state read from URL query string?
   - **A08 — Software + Data Integrity Failures.** Unverified migrations applied to prod? Auto-merge without adjudication?
   - **A09 — Security Logging + Monitoring Failures.** Sensitive operations not logged? `console.log` of tokens?
   - **A10 — SSRF.** Edge function calling user-supplied URLs?

4. **STRIDE pass on the architecture.** For each of: Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege — name one place this could happen and assess.

5. **Write the findings report.** Format:

   ```
   ## CSO findings — <repo> (<scope>)

   ### CRITICAL (N)
   - <file:line> — <vuln category> — <one-line exploit path> → <suggested fix>

   ### HIGH (N)
   ...

   ### MEDIUM (N)
   ...

   ### Verified-safe checks done
   - <category> — checked, no finding
   ```

6. End with a yes/no question: "Open issues for the critical findings, or fix them now?"

## Quality bar

- Every finding cites file:line + a concrete exploit path. "An attacker could…" must be a real path through the code, not theoretical.
- The "Verified-safe" list is mandatory — without it, "no findings" reads as "didn't look."
- One credible catch per pass is the bar. If you find none on a known-touched-recently codebase, double-check the scope was sufficient.

## Anti-patterns

- Generic OWASP lecture without code citations.
- Flagging best-practice gaps that aren't in this codebase ("you should use HSTS" — is HSTS actually missing here? If yes, file:line. If no, drop it.)
- Recommending "add input validation" without naming the specific input.
- Auto-fixing a security finding without operator approval. Security fixes need a deliberate review, not a typo-tier auto-apply.
- Running this once and forgetting. Schedule per quarter on business-critical repos (martina, gardn-native, orbit-app, woodlark portal pipelines).

## Targets in Trent's estate (suggested cadence)

- `martina` — quarterly. Touches finance + every integration.
- `gardn-native` — quarterly. App Store + real user data.
- `orbit-app` + `orbit-whatsapp-backend` — quarterly. LinkedIn OAuth tokens + WhatsApp Business API.
- `studio-woodlark` + `studio-woodlark-professional-services` — biannually. Pipeline outputs client sites; security smells in the pipeline propagate to every client.
- Per-portal output repos (summit-creative, walker-portal, intersend-portal, etc.) — biannually + on every client onboarding.
