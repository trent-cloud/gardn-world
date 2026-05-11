---
layout: ../layouts/LegalLayout.astro
title: "Privacy — Gardn"
description: "Gardn's Privacy Policy. How we collect, use, and protect your personal data, and the rights you have over it under UK GDPR."
---

# Privacy Policy

**Gardn**
Last updated: 2026-05-11
Version 2.0

---

## 1. Who we are

Gardn is a garden intelligence app operated by **Gardn Labs Limited**, a company registered in England and Wales.

**Data controller:** Gardn Labs Limited
**Company number:** 17195491
**Registered address:** 124-128 City Road, London, United Kingdom, EC1V 2NX
**Privacy contact:** privacy@gardn.world

We are committed to protecting your personal data and complying with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.

---

## 2. What this policy covers

This Privacy Policy explains what personal data we collect when you use the Gardn mobile app (available on the Apple App Store) and our website at gardn.world, why we collect it, how we use it, who we share it with, and what rights you have over it.

Please read this policy carefully. By using Gardn, you confirm that you have read and understood it.

---

## 3. Service area

Gardn is currently available to residents of the United Kingdom only. Certain core features — including postcode-based region detection, frost and heat alerts, and community features — depend on UK-specific infrastructure and are not designed for use outside the UK. If you access Gardn from outside the United Kingdom, you do so at your own risk and we cannot guarantee the product will function correctly.

---

## 4. Age

Gardn is not directed at children under the age of 13. We do not knowingly collect personal data from anyone under 13.

Users aged 13–17 may use Gardn, but by registering you confirm that either:
- you are aged 18 or over; or
- you are aged 13–17 and a parent or guardian has reviewed and agreed to this Privacy Policy and our Terms of Service on your behalf.

If you believe a child under 13 has created an account, please contact us at privacy@gardn.world and we will delete it promptly.

---

## 5. What data we collect and why

### 5a. Data you give us directly

| Category | Source | Purpose | Lawful basis |
|----------|--------|---------|--------------|
| Email address | Sign-up | Account creation, password reset, transactional communications | Contract |
| Display name | Sign-up | Public-facing identifier in community features | Contract |
| Postcode (outward code only — e.g. NG5, not NG5 4JL) | Onboarding | Region detection, frost/heat alerts, community district matching | Contract; Legitimate interests (region-specific care advice) |
| Garden description (free text) | Onboarding | AI personalisation of care advice | Consent |
| Garden geometry (drawn polygons on map) | Map onboarding | Personalised plant recommendations | Contract |
| Plant entries (species, dates, notes) | Plant add flow | Core product function | Contract |
| Plant photos | Plant detail screen | User reference; AI health analysis (with separate consent) | Contract; Consent (for AI analysis) |
| Border-scan photos | Onboarding border-scan | Vision AI to detect plants in your garden | Consent |
| Care events (watering, harvesting, etc.) | Care logging | Care reminders, badge progression | Contract |
| Wildlife sightings | Wildlife logger | Wildlife planner feature | Contract |
| Community posts (questions, exchange offers, photos) | Community tab | Public community feature | Contract; Consent (for public visibility) |
| Friend and messaging connections | Community feature | Social graph for community | Contract |

**Note on photos:** Photos you submit for plant identification or health analysis are processed by third-party AI services (see section 7). Please do not include images of people — and in particular, never images of children — in photos you submit to Gardn.

**Note on location:** The "use my location" button on the map onboarding screen centres the map view only. No precise GPS coordinates are stored on your account. We hold only your outward postcode.

**Note on EXIF data:** We strip EXIF metadata (including any GPS coordinates embedded by your camera) from photos on upload. Raw EXIF data is not retained.

---

### 5b. Data we collect automatically

| Category | Source | Purpose | Lawful basis |
|----------|--------|---------|--------------|
| Device type, OS version, app version | App runtime | Compatibility and debugging | Legitimate interests |
| Crash reports | Sentry SDK | Bug fixing and service reliability | Legitimate interests |
| Product analytics events (e.g. plants added, features used, trial start/conversion) | PostHog SDK | Product improvement | Legitimate interests (with opt-out — see section 9) |
| Apple Push Notification token | Expo Notifications | Sending push notifications you have opted into | Consent |

---

## 6. Consent stages

At certain points in using Gardn, we ask for your consent for specific uses of your data. These are managed through **Settings → Privacy & Data** in the app and are entirely voluntary.

**Stage 1 — Anonymised aggregate use** *(default: on)*
We use anonymised, aggregated patterns from your garden data — for example, district-level summaries such as first daffodil dates across Britain — in Gardn's own marketing content and free academic data sharing. No individual records, no photos, and no identifying detail leaves the platform. You can turn this off at any time in Settings → Privacy & Data.

**Stage 2 — Research partnerships** *(default: off)*
If you consent, anonymised data may be shared with academic or horticultural research partners — such as universities, the Royal Horticultural Society, or similar bodies — under data-sharing agreements, for purposes such as climate-resilience research and biodiversity studies.

**Stage 3 — Commercial licensing** *(default: off)*
If you consent, anonymised, aggregated data may be included in commercially licensed datasets sold to partners such as seed companies or garden retailers. This data cannot be linked back to you.

Each consent is independent. You can withdraw any of them at any time in Settings → Privacy & Data. Withdrawal is honoured within 30 days — the time needed for downstream partners to refresh their data extracts. Gardn never sells personal data.

These consents apply to all data classes named in this policy, including Plant lifecycle and moments data (Section 8) and Wildlife and biodiversity data (Section 9).

---

## 7. Third parties we share data with

By using Gardn, your data is processed by the following third-party services. Each is a data processor under UK GDPR and operates under its own privacy policy. We have data processing agreements in place with each.

| Service | Purpose | Data shared | Location |
|---------|---------|-------------|----------|
| **Supabase (Supabase Inc.)** | Backend database, authentication, file storage | All app data (user profile, plants, photos, posts, etc.) | EU (Frankfurt) |
| **Anthropic (Anthropic PBC)** | AI plant identification fallback, border-scan analysis, health check-ins, Ask Gardn assistant | User photos (vision endpoints), garden text descriptions, plant care queries. No email or account identifier. | USA (Standard Contractual Clauses) |
| **Plant.id (FlowerChecker s.r.o.)** | Primary plant identification from photos | User photos. No account identifier. | EU (Czech Republic) |
| **Mapbox (Mapbox, Inc.)** | Satellite map tiles for garden drawing | Approximate tile coordinates only. No postcode passed. | USA (Standard Contractual Clauses) |
| **postcodes.io (Ideal Postcodes Ltd)** | Postcode-to-region lookup | Outward postcode only | UK |
| **PostHog (PostHog Inc.)** | Product analytics | Anonymised event data, user UUID (not email) | EU (eu.posthog.com) |
| **Sentry (Functional Software, Inc.)** | Crash and error logging | Crash stack traces, user UUID | USA (Standard Contractual Clauses) |
| **Resend (Resend, Inc.)** | Transactional email delivery | Email address, message content | USA (Standard Contractual Clauses) |
| **Apple Inc.** | App Store, App Store IAP, Sign in with Apple, Push Notifications | Account and device info (per Apple's own policy) | USA |
| **Google LLC** | Google Sign-In (optional authentication method) | Account email only | USA |

Where data is transferred outside the UK, we rely on Standard Contractual Clauses (SCCs) or the UK International Data Transfer Agreement (IDTA) as the legal mechanism for transfer.

---

## 8. Plant lifecycle and moments data

**What:** Observations you log about your plants — first bud, first flower, first frost, first harvest, and similar plant-led moments. These are recorded as plant_lifecycle_events in our database (displayed in the app as "Moments"), with the date observed, any notes you add, and any photo you attach.

**Why:** To power Gardn's year-on-year memory features (such as showing you when a plant flowered last year), to refine our seasonal calendar with real observation data from UK gardens, and — only with your explicit consent under the Stage consent flags above — to contribute to anonymised aggregate datasets on UK phenology patterns.

**Legal basis:** Contract for the core memory features; Consent (Stage 1, 2, and 3 flags) for any aggregate, research, or commercial use.

**Your control:** Each record is stored with a snapshot of your consent flag settings at the time it was created. Withdrawing consent excludes future use of that record in any extract — this has retroactive effect on future processing of all prior records. Revoking a consent flag excludes photos from future extracts but does not delete them from your in-app timeline; photo deletion is a separate action available per-record in the plant detail screen, or via full account deletion. You can withdraw consent or delete individual records at any time in Settings → Privacy & Data and the plant detail screen.

---

## 9. Wildlife and biodiversity data

**What:** Species you log in the wildlife planner, goals you set, and photos you submit for wildlife identification.

**Why:** To power the wildlife planner feature, provide AI-powered wildlife recommendations, and — only with your explicit consent under the Stage consent flags above — to contribute to anonymised aggregate data on biodiversity patterns in UK gardens.

**Legal basis:** Contract for the core wildlife planner feature; Consent (Stage 1, 2, and 3 flags) for any aggregate, research, or commercial use.

---

## 10. Data we do not collect or share

- We **never sell** personal data
- No advertising IDs, IDFA, or Apple AdAttributionKit
- No precise GPS coordinates stored
- No biometric data
- No payment card numbers (all billing is handled by Apple; we never see card data)
- No user contact lists
- No keystroke logging, session replay, or heatmap tracking
- No data sale, ever — including when Stage 3 commercial licensing is enabled. Only anonymised, aggregated, non-identifiable data is licensed commercially.

---

## 11. Your controls

**Analytics opt-out:** You can opt out of PostHog product analytics at any time in Settings → Privacy & Data. Opting out stops new event collection immediately.

**Push notifications:** You can manage notification preferences in Settings → Notifications, or through your device's iOS notification settings.

**Consent flags:** All three consent stages (section 6) are independently controllable in Settings → Privacy & Data.

---

## 12. How long we keep your data

| Data type | Retention period |
|-----------|-----------------|
| Account data (email, profile) | Duration of account + 30 days post-deletion |
| Plant, garden, and care event data | Duration of account + 30 days post-deletion |
| Photos | Duration of account + 30 days post-deletion |
| PostHog analytics events | 12 months rolling |
| Sentry crash logs | 90 days rolling |
| Resend email logs | 30 days rolling |
| Backups | 30 days rolling |
| Subscription records | 7 years (legal and accounting requirement) |
| Anthropic / Plant.id processing logs | Per their own retention policies (Anthropic: 30 days; Plant.id: per their policy) |

When you delete your account, all personal data is queued for deletion within 30 days. Anonymised, aggregated data already included in research or commercial datasets (where you had consented) is not recalled, as it cannot be linked back to you.

---

## 13. Your rights under UK GDPR

You have the following rights over your personal data:

**Right of access** — request a copy of the data we hold about you.

**Right to rectification** — ask us to correct inaccurate data.

**Right to erasure** — ask us to delete your data. You can also delete your account directly in Settings → Account → Delete Account.

**Right to data portability** — export your garden data in JSON format at any time from Settings → Privacy & Data → Export Data.

**Right to restrict processing** — ask us to limit how we use your data in certain circumstances.

**Right to object** — object to processing based on legitimate interests.

**Right to withdraw consent** — where processing is based on consent (garden description AI personalisation, photo AI analysis, border-scan, community posts, and the three Stage consent flags), you can withdraw at any time in Settings → Privacy & Data.

**Right not to be subject to automated decision-making** — Gardn does not make legally significant automated decisions about you.

To exercise any of these rights, email privacy@gardn.world. We will respond within one calendar month.

---

## 14. Right to complain

If you believe we are not handling your data lawfully, you have the right to complain to the UK's Information Commissioner's Office (ICO):

**Website:** ico.org.uk
**Helpline:** 0303 123 1113

We would always prefer the opportunity to resolve concerns directly first — please contact privacy@gardn.world before escalating.

---

## 15. Cookies and tracking

The Gardn mobile app does not use cookies. Our website at gardn.world may use essential cookies for basic site functionality. We do not use advertising or tracking cookies.

PostHog, our analytics provider, uses device identifiers (not cookies) within the app to associate events with a session. These identifiers are pseudonymous and not linked to your email address. You can opt out at any time (see section 11).

---

## 16. Changes to this policy

We may update this Privacy Policy from time to time. When we do, we will update the effective date at the top of this document. For material changes, we will notify you via an in-app notice or email before the change takes effect. Continued use of Gardn after notification constitutes acceptance of the updated policy.

Previous versions of this policy are available on request at privacy@gardn.world.

---

## 17. Contact us

**Email:** privacy@gardn.world
**Post:** Gardn Labs Limited, 124-128 City Road, London, United Kingdom, EC1V 2NX

For urgent data breach concerns, mark your email "URGENT: Data Breach". We will acknowledge within 24 hours and respond fully within 72 hours in accordance with our ICO notification obligations.

---

*Gardn Privacy Policy v2.0*
*Gardn Labs Limited — Company No. 17195491*
