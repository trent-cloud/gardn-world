---
name: xero-integration
version: 2
description: Martina-specific Xero-touching capability skill — verified API-surface map, granular-scope reality, push-from-source mental model, anti-patterns from the 2026-05-18 bank-rec session.
triggers:
  - "agent in Xero"
  - "bank rec"
  - "reconcile in Xero"
  - "bills agent"
  - "card spend in Xero"
  - "Spend Money via API"
  - "post to Xero"
  - "Xero scope"
  - "Xero API"
  - "any planning conversation about an agent reading from or writing to Xero"
allowed-tools:
  - Read
  - Edit
  - Write
  - Bash
reads:
  - supabase/functions/_shared/xeroToken.ts
  - src/utils/xeroOAuth.js
  - supabase/functions/_shared/createXeroBill.ts
  - "this skill's verified-findings section"
  - "Xero developer docs for the endpoint being touched"
writes:
  - "new edge functions"
  - "OAuth scope changes (always behind explicit user re-auth)"
  - "probe functions for verifying API surface before building"
calls:
  - "Xero Accounting API (api.xero.com/api.xro/2.0)"
  - "Xero Identity (identity.xero.com)"
  - "NEVER Finance API or Bank Feeds API without confirming Woodlark's plan supports them"
---

# Skill: xero-integration

---

## Purpose

Stop the agent veering on Xero-integration tasks. Capture (a) the canonical mental model for how agents interact with Xero, (b) which API surfaces are reachable on Woodlark's standard plan vs partner-only, (c) the OAuth-scope traps, (d) the anti-patterns I've already wasted a session on. Read this **before** designing any new Xero-touching capability.

---

## Mental model — push-from-source, not poll-the-queue

This is the single most important framing. Get it wrong and you'll waste a session looking for an API surface that doesn't exist.

**Wrong model (what I veered into):** "The agent reads Xero's unreconciled queue (the Reconcile tab), classifies each statement line, codes it." This requires an API surface that exposes raw bank-feed statement lines — **that surface is partner-tier only and not reachable on Woodlark's plan.**

**Right model (how Dext, Hubdoc, every Xero rec integration actually works):**

1. The agent reads from a **source of truth** outside Xero — Gmail (for bills), card-provider API (for card spend), CSV upload, OCR'd PDF, etc.
2. The agent classifies each item — vendor, account code, VAT, date, amount.
3. The agent **POSTs into Xero** as one of three primitives:
   - `POST /Invoices` Type=ACCPAY → Bill (for invoices the user owes; today's bills agent).
   - `POST /BankTransactions` Type=SPEND → Spend Money (for card spends, ad-hoc expenses, anything debited from a bank account that isn't a bill payment).
   - `POST /Payments` against an existing AUTHORISED Invoice → marks the bill as paid.
4. Xero's bank-feed brings raw statement lines in **independently** of the agent.
5. Xero's own auto-reconciliation engine matches API-created entries against statement lines on **amount + date** (primary), plus Payee / Description / Reference / Analysis Code fields. Once matched, the statement line is reconciled.

The agent never touches the unreconciled queue. It produces the **entries to match against** and trusts Xero's matching engine to close the loop.

This is exactly the bills-agent pattern shipped 2026-05-18. Same shape applies to card spend, just with a different ingester.

---

## API surface map — what's reachable on Woodlark's plan

Verified empirically via spike `xero-debug-bank-statements` on 2026-05-18. **Re-verify if Woodlark's Xero plan changes.**

### ✅ Reachable on standard plan, no extra grant needed

| Endpoint | Use | Notes |
|---|---|---|
| `GET /connections` | Discover tenants | Returns array of `{tenantId, tenantName, tenantType}`. |
| `GET /api.xro/2.0/Accounts` | Chart of accounts + bank account metadata | Filter `Type==BANK` to find bank accounts. `BankAccountNumber`, `AccountID`, `Code`, `Name` fields. |
| `GET /api.xro/2.0/Contacts` | List/search vendor contacts | Used by `createXeroBill.ts` for vendor resolution. |
| `POST /api.xro/2.0/Contacts` | Create new vendor | Used when a Bill arrives for a vendor not yet in Xero. |
| `GET /api.xro/2.0/Invoices` | List bills + sales | Used by `xero-financial-overview` for AR/AP totals. |
| `POST /api.xro/2.0/Invoices` | Create Bill (ACCPAY) | Used by today's bills agent. Status=AUTHORISED writes a live bill. |
| `PUT /api.xro/2.0/Invoices/{id}/Attachments/{filename}` | Attach PDF to bill | Used by bills agent to attach original invoice PDF. Requires `accounting.attachments` scope. |

### ⚠️ Requires a scope our current token doesn't have — open question

| Endpoint | Use | Status |
|---|---|---|
| `GET /api.xro/2.0/BankTransactions` | List Spend/Receive Money entries in Xero | 401 on current scope set. |
| `GET /api.xro/2.0/BankTransfers` | Inter-account transfers | 401. |
| `POST /api.xro/2.0/BankTransactions` Type=SPEND | Create Spend Money | 401. |
| `POST /api.xro/2.0/Payments` | Pay an existing invoice | 401. |

The broad scope that historically covered these is `accounting.transactions`. **On Martina that broad scope is now rejected with `invalid_scope` at the Xero identity server** (Xero enforcing granular-only ahead of the announced 2027-09 broad-scope deprecation deadline). There is no documented granular replacement for BankTransactions/BankTransfers in Xero's scope catalogue as of 2026-05-18.

**Open question for the next card-spend reconciliation session:** is there a granular bank-transaction scope (e.g. `accounting.banktransactions`)? Does Xero accept `accounting.transactions` if the app is re-registered as a different type? Does Custom Connections (premium tier for AU/NZ/UK/US orgs) unlock it?

**Earlier hypothesis ruled out 2026-05-18 ~21:35 BST:** "the 401 is because we didn't tick bank accounts during OAuth consent." The Xero consent screen for `[invoices, contacts, attachments, settings]` shows only org-level access (Attachments, Contacts, Organisation settings, Invoices and related documents) — no per-bank-account picker exists for these scopes. The 401 is a missing-scope issue, not a missing-grant issue.

### ❌ Not reachable on Woodlark's plan (partner-tier / paid)

| Endpoint | Why blocked | Don't try |
|---|---|---|
| `GET /api.xro/2.0/BankStatements` | Returns 404. Standard Accounting API documents the endpoint but it's gated behind partner-only access. | Reading the unreconciled queue. |
| `GET /finance.xro/1.0/BankStatementsPlus` | Returns 404. Finance API is a paid tier — not on standard plans. | Same — reading raw statement lines. |
| `POST /bankfeeds.xro/1.0/Feeds/{id}/Statements` | Bank Feeds API — requires application certification + annual self-assessment + security-standard compliance. | Pushing OUR app's bank feed into Xero (replacing direct bank feed). Heavyweight, months of compliance work. |

Empirical proof and date is in the "Verified findings" section at the bottom of this skill.

---

## OAuth scopes

Current declared scopes in `src/utils/xeroOAuth.js` (as of 2026-05-18 ~21:35 BST): `offline_access`, `accounting.invoices`, `accounting.contacts`, `accounting.attachments`, `accounting.settings`.

**Scope coverage:**
- `accounting.invoices` — granular. Covers Invoices (ACCPAY + ACCREC) read+write. **This is the granular replacement for `accounting.transactions` for the bills agent.**
- `accounting.contacts` — granular. Read+write Contacts and Contact Groups.
- `accounting.attachments` — granular. Read+write attachments on Invoices and Bank Transactions.
- `accounting.settings` — granular. Read+write Accounts, Tracking Categories, Branding, Tax Rates.

**Scopes intentionally NOT in current token:**
- `accounting.transactions` (broad) — historically covered Invoices + Bank Transactions + Transfers + Purchase Orders + Expense Claims + Receipts + Prepayments + Overpayments. **Xero rejects this scope on Martina with `invalid_scope`** despite the documented 2027-09 broad-scope migration deadline. Enforcing granular-only ahead of schedule. Don't reintroduce without verifying acceptance via a fresh re-auth attempt.
- `openid`, `profile`, `email` (OIDC) — Xero tightened OIDC scope acceptance on non-marketplace web apps tonight (2026-05-18 between 17:00 and 21:00 BST). Dropped from request; we don't need OIDC profile claims for API access.

**Granular migration deadline (per Xero docs):** Apps created before 2026-03-02 have until 2027-09 to migrate. **Empirically Xero is enforcing earlier on at least some apps.** Treat granular as required-now, not by-2027.

**No published granular scope for BankTransactions / BankTransfers as of 2026-05-18.** Open investigation flagged in the API-surface map above.

---

## Idempotency

Xero supports `Idempotency-Key` header on POST endpoints (`accounting`, `assets`, `files`, `payroll`, `projects`). Pass a UUID or stable hash; if the same key arrives twice within 24h Xero returns the original response instead of creating a duplicate.

**Pattern for autonomous agents:**
- For bills: `Idempotency-Key: bill-{message_id}-{vendor}-{amount}` (Gmail message_id is stable).
- For card spends: `Idempotency-Key: tx-{source}-{external_tx_id}` where `external_tx_id` is the card provider's transaction reference.

Even with idempotency keys, also dedupe on the source side — store `xero_invoice_id` / `xero_banktransaction_id` on the candidate row after successful POST. Skip rows that already have an ID.

Reference: [Xero — Idempotent requests](https://developer.xero.com/documentation/guides/idempotent-requests/idempotency/).

---

## Auto-reconciliation matching — what Xero matches on

When Xero's bank-feed brings in a statement line, its auto-suggest engine tries to match it against existing BankTransactions / Payments / Invoices in the org. Matching fields (per Xero's bank-rules + auto-suggest):

- **Amount** (exact) + **Date** (statement-line date vs entry date, with some tolerance) — primary match.
- **Payee / Contact name** — secondary (community-requested improvement; not yet ML-strong).
- **Description / Reference / Analysis Code** — text-match used by bank rules and auto-suggest.

**Implication for the agent:** when creating entries via API, set the **Reference** field to something matchable (e.g. the vendor canonical name + a short identifier). Don't leave Reference blank. The agent's classify step should produce a deterministic Reference string.

**Multi-match handling:** if multiple invoices on the same date have the same amount, Xero matches in newest-to-oldest order. Avoid creating multiple AUTHORISED invoices for the same vendor + amount + date — Xero may match the wrong one.

---

## Source-of-truth options for non-bill spend (card transactions, ad-hoc)

Ranked by acceptability for Woodlark's scale + Trent's regulatory appetite:

1. **CSV import (deterministic, ships today).** Operator exports CoT/Revolut CSV, drops it in Martina, agent processes the lot. ~5 min/month manual. No new auth, no regulatory bar.

2. **Revolut Business API (direct, achievable).** Revolut Business has a developer API for connected business accounts. OAuth flow, transactions endpoint, no TPP requirement (it's their own product API, not Open Banking). ~2-3h to integrate per the BACKLOG.

3. **Capital on Tap Open Banking direct.** Endpoints exist (`openbanking.capitalontap.com/as/token.oauth2`, `/aisp/account-access-consents`) but require an Open Banking Directory ID, which means FCA AISP/TPP registration — multi-month process, ongoing compliance. **Not viable for solo build.**

4. **Capital on Tap via Finexer aggregator.** Finexer is the only listed aggregator. Sign-up may or may not accept Woodlark-scale usage (TrueLayer declined the personal case in 2026-05-14). Cost-of-trying: one form.

5. **Bank Feeds API.** Push CoT/Revolut data into Xero as if we were the bank. Requires Xero application certification + annual self-assessment + security-standard compliance (2FA, encryption-at-rest, justifiable business need). **Heavyweight, months of compliance work.** Not realistic for solo build.

**Default recommendation:** start with CSV (always works). Email Capital on Tap + apply to Finexer in parallel (low effort, possibly unlocks live sync). Build Revolut Business API integration when card spend frequency justifies it.

---

## Anti-patterns

Things I have already done or nearly done that don't work. Don't repeat.

1. **"The agent reads Xero's reconcile queue."** No it doesn't. That queue is partner-only. Push from source, let Xero auto-match.
2. **"`accounting.transactions` scope is enough for BankTransactions."** Not on its own — Xero's per-bank-account consent UX is a separate grant invisible from the developer side. Always test BankTransactions with a probe before designing around it.
3. **"Trust the docs page title."** The `/BankStatements` Accounting API docs page exists; the endpoint returns 404 in practice on standard plans. Always probe before designing.
4. **"Ship autonomous mode without a threshold gate."** The bills agent has `BILLS_AUTO_CREATE` + £100 ceiling. Any new write capability needs the same shape — autonomous below threshold, flagged above.
5. **"Skip vendor map seeding for one-off vendors."** Today's session hit five sequential vendors needing migrations before we built the inline self-serve form. Always include the operator self-serve path in v1.
6. **"Adjudicate everything."** The bills agent uses gpt-4o-mini adjudication because email-text-to-extraction is a faithfulness check. For card transactions where the source IS the firm record (bank's transaction history), adjudication is unnecessary — there's no faithfulness question.

---

## Procedure when building a new Xero-touching capability

1. **Read this skill.** Specifically the mental model + API surface map.
2. **Identify the source-of-truth.** Email, card API, CSV, OCR, manual — what's the agent reading FROM?
3. **Identify the Xero write primitive.** Invoice (ACCPAY/ACCREC), BankTransaction (SPEND/RECEIVE), Payment, BankTransfer.
4. **Probe before designing.** If using an endpoint not in this skill's verified-reachable list, write a small read-only probe edge function, deploy with a temporary BillsView/admin UI button, click, paste response, decide.
5. **Choose scopes minimally.** Add only what the new capability needs. Trigger user re-auth via the Reconnect Xero path. When user-consenting, tick the bank accounts if BankTransactions are involved.
6. **Set Idempotency-Key on every POST.** Use a stable hash from the source data.
7. **Set Reference field on every BankTransaction / Payment.** Match Xero's auto-suggest engine; don't leave it blank.
8. **Three-mode UX.** Manual approve → batch approve → autonomous-via-env-var. The env var name should mirror `BILLS_AUTO_CREATE`. Always £100 ceiling.
9. **Inline self-serve mapping form.** New vendors should be mappable by the operator without a migration round-trip.
10. **Update this skill's verified-findings section** if the probe surfaces something new.

---

## Verified findings record

**2026-05-18 — `xero-debug-bank-statements` probe against Woodlark tenant (id `2b809433-…1554f7`):**

- `/api.xro/2.0/BankStatements` → 404 across all 9 active BANK accounts. **Conclusion: partner-only.**
- `/finance.xro/1.0/BankStatementsPlus` → 404 at org level. **Conclusion: Finance API not on plan.**
- `/api.xro/2.0/BankTransactions` (no filter) → 401 AuthorizationUnsuccessful. **Conclusion: per-bank-account grant missing in current OAuth token.**
- `/api.xro/2.0/BankTransfers` → 401 AuthorizationUnsuccessful. **Same cause.**
- `/api.xro/2.0/Accounts?where=Type=="BANK"` → 200, returns 9 ACTIVE bank accounts.
- `/connections` → 200, returns 1 tenant.

Tokens current at probe time: scopes `accounting.transactions`, `accounting.contacts`, `accounting.attachments`, `accounting.settings`. Re-auth widened scopes earlier same day per `state/CURRENT_SESSION.md`.

**Next verification needed (deferred):**
- Confirm the bank-account-grant theory by re-authing with bank accounts ticked; expect BankTransactions to return 200.
- Confirm `Idempotency-Key` header is accepted on `POST /BankTransactions` (Xero's idempotency support is documented for `accounting` API broadly; haven't tested specific endpoint).

---

## Sources

- [Xero Developer — Accounting API Bank Transactions](https://developer.xero.com/documentation/api/accounting/banktransactions)
- [Xero Developer — Accounting API Bank Statements](https://developer.xero.com/documentation/api/accounting/bankstatements)
- [Xero Developer — Finance API Bank Statements Plus](https://developer.xero.com/documentation/api/finance/bankstatementsplus)
- [Xero Developer — Bank Feeds API Overview](https://developer.xero.com/documentation/api/bankfeeds/overview)
- [Xero Developer — Scopes guide](https://developer.xero.com/documentation/guides/oauth2/scopes/)
- [Xero Developer — Granular Scopes FAQ](https://developer.xero.com/faq/granular-scopes)
- [Xero Developer — Idempotent requests](https://developer.xero.com/documentation/guides/idempotent-requests/idempotency/)
- [Xero Developer — App partner / Bank Feeds certification](https://developer.xero.com/partner/security-standard-for-xero-api-consumers)
- [Xero Central — Bank reconciliation in Xero](https://central.xero.com/s/article/Bank-reconciliation-in-Xero)
- [Xero Central — Find transactions to match to bank statement lines](https://central.xero.com/s/article/Reconcile-a-bank-statement-line-using-Find-Match)
- [Hubdoc + Xero — bank reconciliation pattern](https://content.hubdoc.com/hubdocs-youtube-channel/streamlined-bank-reconciliation-with-hubdoc-xero)
- [Dext — publish to bank accounts to reconcile](https://help.dext.com/en/s/article/how-to-publish-to-bank-accounts-to-reconcile-paid-items-in-xero)
- [Open Banking Tracker — Capital on Tap](https://www.openbankingtracker.com/provider/capitalontap)
