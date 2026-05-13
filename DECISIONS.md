# DECISIONS — Gardn

## Re-open protocol

Flag explicitly, state what changed, state cost of reopening, recommend. Don't silently override.

---

## Locked decisions

### Never delete gardens.user_id
Decided: 2026-04
Rationale: RLS fallback during the shared-garden rollout. Every existing garden row uses user_id for read/write access. garden_members is the target model, but removing the column before full migration breaks production for all existing users.
Cost to reopen: Cannot reopen until every garden row has a garden_members entry — requires a data migration verified against prod.
Status: locked

---

### Always compress images via compressImageForApi() before Claude or Plant.id
Decided: 2026-04
Rationale: Anthropic has a 5 MB limit. Skipping compression fails silently in production — no error surfaced to the user. The function is memoised on a WeakMap keyed on the File reference, so eager background compression on photo-pick is reused at save time.
Cost to reopen: Any bypass path would silently fail on large photos in prod.
Status: locked

---

### All Anthropic and Plant.id calls via src/utils/apiProxy.js
Decided: 2026-04
Rationale: Direct fetch() bypasses JWT auth, per-user rate-limit enforcement, and the err.code = 'RATE_LIMITED' surfacing callers depend on. API keys live as Supabase edge-function secrets only — never in client env.
Cost to reopen: Every call site would need re-auditing for rate-limit enforcement and key exposure.
Status: locked

---

### No paid tiers, no paywall UI, no is_premium flags pre-launch
Decided: 2026-04
Rationale: Deliberate scope constraint. Paid entitlements land at App Store launch only. Adding paywall UI now locks in a pricing model before real usage data exists. Paid tier candidates post-launch: AI coach (metered), Journey storage cap (retention moat), multi-garden support.
Cost to reopen: Requires IAP integration (Stripe or RevenueCat + App Store IAP), RLS changes, and UI across multiple screens.
Status: locked

---

### PKCE auth flow — flowType: 'pkce' in supabaseClient.js
Decided: 2026-04
Rationale: Eliminates the token-in-URL-fragment class of bugs. Non-negotiable for App Store submission — Apple reviews auth implementations.
Cost to reopen: Auth flow rewrite with significant regression risk.
Status: locked

---

### Owner-bound storage RLS on all user-content buckets
Decided: 2026-04
Rationale: All buckets key on storage.foldername(name)[1] = auth.uid()::text. Clients write only to ${uid}/... paths. Making any bucket public without this constraint leaks other users' content.
Cost to reopen: Per-bucket policy audit and migration.
Status: locked

---

### Google OAuth consent screen stays in Testing mode
Decided: 2026-04
Rationale: Martina has exactly 3 users. Production-mode verification takes days-to-weeks. Test mode is sufficient for the current user set.
Cost to reopen: Full Google OAuth verification submission — required when a 4th user onboards.
Status: locked

---

## Under review

*Empty.*

---

## Archive

*Empty.*
