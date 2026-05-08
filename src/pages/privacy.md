---
layout: ../layouts/LegalLayout.astro
title: "Privacy — Gardn"
description: "Gardn's Privacy Policy. How we collect, use, and protect your personal data, and the rights you have over it under UK GDPR."
---

# Privacy Policy

**Gardn**
Last updated: 2026-05-08
Version 1.0

---

## Who we are

Gardn is a garden intelligence platform operated by Gardn Labs Ltd, a company registered in England and Wales. We build and operate the Gardn mobile application (the "App") available on the Apple App Store and, in future, Google Play.

**Data controller:** Gardn Labs Ltd
**Registered address:** 4 Arno Vale Gardens, Woodthorpe, Nottingham, England, NG5 4JL
**Contact:** privacy@gardn.world

We are committed to protecting your personal data and complying with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.

---

## What this policy covers

This Privacy Policy explains what personal data we collect when you use the Gardn app and website at gardn.world, why we collect it, how we use it, who we share it with, and what rights you have over it.

Please read this policy carefully. By using Gardn, you confirm that you have read and understood it.

---

## What data we collect and why

### 1. Account data

**What:** Your name, email address, and password (stored as a secure hash — we never store your password in plain text).

**Why:** To create and manage your account, authenticate you, and communicate with you about your subscription and account.

**Legal basis:** Contract (necessary to provide you with the service you have signed up for).

### 2. Garden and plant data

**What:** The plants you add to your garden, including plant names, photos you upload, health notes, care events, dates, and the garden borders or spaces you create.

**Why:** To provide Gardn's core service — tracking your garden and giving you personalised, timely advice about your plants.

**Legal basis:** Contract.

### 3. Garden map and location data

**What:** When you draw your garden using our map feature, we process your postcode and use satellite imagery and map tiles provided by Mapbox (see Third-party services below) to show you an aerial view of your property. We do not store your precise GPS coordinates; we use your postcode to determine your district and provide region-specific gardening advice and frost alerts.

**Why:** To show you an accurate map of your garden, provide UK-region-specific care advice calibrated to your climate, and deliver frost alerts relevant to your area.

**Legal basis:** Contract and legitimate interests (providing a location-accurate service).

### 4. Photos you upload

**What:** Photos of your plants, garden borders, and any images you submit for plant identification or health check-ins.

**Why:** Your photos are sent to our AI plant identification partner (Plant.id) and to Anthropic's AI models (see Third-party services below) to provide plant identification, health assessments, and border-scan analysis. Photos are also stored as part of your garden's history — your "memory layer" — so you can track how your plants change over time.

**Legal basis:** Contract.

**Note:** When you submit a photo for identification or health analysis, it is processed by third-party AI services. Please do not include images of people, and particularly not images of children, in photos you submit.

### 5. AI interaction data

**What:** The messages and questions you send to Ask Gardn (our AI assistant) and any queries you make through the Discover feature.

**Why:** To provide AI-powered gardening advice personalised to your garden. Your messages are processed by Anthropic's AI models (see Third-party services below). We do not use your Ask Gardn conversations to train AI models.

**Legal basis:** Contract.

### 6. Community content

**What:** Posts, comments, photos, and other content you share in the Gardn community feed. Your community posts are associated with your display name and are visible to other Gardn users in your geographic area.

**Why:** To operate the Gardn community feature, which connects gardeners in your local area.

**Legal basis:** Contract and legitimate interests (community feature operation).

**Important:** Community posts are visible to other users. Do not share personal information (such as your full address or phone number) in community posts.

### 7. Wildlife and biodiversity data

**What:** Species you log in the wildlife planner, goals you set, and photos you submit for wildlife identification.

**Why:** To power the wildlife planner feature, provide AI-powered wildlife recommendations, and allow us to build aggregate, anonymised data on biodiversity patterns in UK gardens.

**Legal basis:** Contract and, where data is aggregated and anonymised for research, legitimate interests.

### 8. Subscription and billing data

**What:** Whether you are on the Free tier or Premium tier, your subscription status, trial start and end dates, and the source of your subscription (App Store or Google Play).

**Why:** To manage your subscription and provide you with access to the features you have paid for. Note: we do not handle your payment card details directly — all billing is processed by Apple (App Store) or Google (Google Play). We receive only a confirmation of your subscription status from them.

**Legal basis:** Contract.

### 9. Usage and analytics data

**What:** Information about how you use the App — which features you use, how often, and in what order. This is collected via PostHog, our analytics platform, hosted on EU servers. This includes events such as plants added, health check-ins completed, community posts made, and trial start/conversion events. We do not collect session replay data at v1 launch.

**Why:** To understand how people use Gardn so we can improve the product, fix bugs, and make features better. Also to understand subscription conversion patterns.

**Legal basis:** Legitimate interests (product improvement and business analytics).

**Your control:** You can opt out of analytics data collection in the App under Settings → Privacy & Data.

### 10. Error and crash data

**What:** Technical data about errors and crashes in the App, collected via Sentry. This includes device type, operating system version, app version, and a stack trace of the error. It does not include your garden content or personal messages.

**Why:** To identify and fix bugs so the App works reliably for everyone.

**Legal basis:** Legitimate interests (service reliability).

### 11. Push notification tokens

**What:** A device token issued by Apple (APNS) or Google (FCM) that allows us to send push notifications to your device.

**Why:** To deliver frost alerts, watering reminders, community notifications, and other in-app notifications you have opted into.

**Legal basis:** Consent (you are asked to grant notification permission when you first add a plant).

**Your control:** You can manage notification preferences in the App under Settings → Notifications, or through your device's notification settings.

### 12. Email address (transactional)

**What:** Your email address, used to send operational emails (such as moderation digests for community content you have posted, and subscription-related communications). Email delivery is handled by Resend (see Third-party services below).

**Why:** To communicate important information about your account and community activity.

**Legal basis:** Contract and legitimate interests.

---

## Consent stages

At certain points in using Gardn, we ask for your explicit consent for specific uses of your data. These are:

1. **Anonymised aggregate data for research** — if you consent, we may use anonymised, aggregated patterns from your garden data (e.g. regional plant health trends, frost event data) in research partnerships or published insights. We never share identifiable data.
2. **Research partnerships** — if you consent, anonymised data may be shared with research partners (such as universities or biodiversity organisations) studying UK gardening and wildlife patterns.
3. **Commercial licensing** — if you consent, anonymised, aggregated data may be included in commercially licensed datasets. This data cannot be linked back to you.

You can withdraw any of these consents at any time in Settings → Privacy & Data.

---

## Third-party services we use

By using Gardn, your data is processed by the following third-party services. Each operates under its own privacy policy.

| Service | Purpose | Data shared | Location |
|---------|---------|-------------|----------|
| **Anthropic** | AI plant identification fallback, border-scan analysis, Ask Gardn assistant, health check-ins, wildlife photo ID | Photos, text queries, garden context | USA (with UK GDPR safeguards) |
| **Plant.id** | Plant identification from photos | Plant photos | EU |
| **Mapbox** | Garden map tiles, satellite imagery, postcode geocoding | Postcode, map tile requests | USA (with UK GDPR safeguards) |
| **Supabase** | Database hosting and backend infrastructure | All garden and account data | EU |
| **Vercel** | Marketing website (gardn.world) hosting | Website visit data | USA (with UK GDPR safeguards) |
| **PostHog** | Product analytics | Usage events (anonymised) | EU |
| **Sentry** | Error and crash monitoring | Technical error data | USA (with UK GDPR safeguards) |
| **Resend** | Transactional email delivery | Email address | USA (with UK GDPR safeguards) |
| **Apple App Store** | App distribution and in-app subscription billing | Subscription status | USA |
| **Google Play** | App distribution and in-app subscription billing (Android, future) | Subscription status | USA |
| **Apple / Google (OAuth)** | Sign-in via Apple or Google | Email address, display name | USA |
| **Expo / EAS** | App build and over-the-air update delivery | App version data | USA (with UK GDPR safeguards) |

Where data is transferred outside the UK, we rely on Standard Contractual Clauses (SCCs) or the UK International Data Transfer Agreement (IDTA) to ensure appropriate safeguards.

---

## How long we keep your data

| Data type | Retention |
|-----------|-----------|
| Account data | Until you delete your account, then 30 days before permanent deletion |
| Garden and plant data | Until you delete it or delete your account |
| Photos | Until you delete them or your account. Deleted photos are removed from storage within 30 days |
| Community posts | Until you delete them or your account. Deleted posts are removed within 7 days |
| Ask Gardn conversation history | 12 months rolling, then automatically deleted |
| Analytics events | 24 months, then automatically deleted |
| Error/crash logs | 90 days |
| Subscription records | 7 years (legal and accounting requirement) |

---

## Your rights under UK GDPR

You have the following rights over your personal data:

**Right of access** — you can request a copy of the personal data we hold about you.

**Right to rectification** — you can ask us to correct inaccurate data.

**Right to erasure ("right to be forgotten")** — you can ask us to delete your data. You can also delete your account directly in the App under Settings → Account → Delete Account.

**Right to data portability** — you can export your garden data in JSON format at any time from Settings → Privacy & Data → Export Data.

**Right to restrict processing** — you can ask us to limit how we use your data in certain circumstances.

**Right to object** — you can object to processing based on legitimate interests.

**Right to withdraw consent** — where processing is based on consent (analytics, research, wildlife data), you can withdraw at any time in Settings → Privacy & Data.

**Right to complain** — you have the right to complain to the UK's Information Commissioner's Office (ICO) at ico.org.uk if you believe we are not handling your data lawfully. We would always appreciate the chance to address your concerns first — please contact privacy@gardn.world.

To exercise any of these rights, email us at privacy@gardn.world. We will respond within 30 days.

---

## Children

Gardn is not directed at children under the age of 13. We do not knowingly collect personal data from children under 13. If you believe a child under 13 has provided us with personal data, please contact us at privacy@gardn.world and we will delete it promptly.

---

## Security

We take reasonable technical and organisational measures to protect your personal data, including:

- Passwords are stored as secure hashes (never in plain text)
- All data in transit is encrypted using TLS
- Database access is controlled by row-level security policies
- We limit access to personal data to those who need it to operate the service
- We use Sentry to monitor for anomalies and errors in real time

No method of transmission or storage is completely secure. If you believe your account has been compromised, please contact us immediately at privacy@gardn.world.

---

## Cookies and tracking

The Gardn mobile app does not use cookies. Our website at gardn.world may use essential cookies for basic functionality. We do not use tracking or advertising cookies on our website.

---

## Changes to this policy

We may update this Privacy Policy from time to time. When we do, we will update the "Last updated" date at the top of this document and, for material changes, notify you via an in-app notice or email. Continued use of the App after notification constitutes acceptance of the updated policy.

---

## Contact us

For any questions about this Privacy Policy or how we handle your data:

**Email:** privacy@gardn.world
**Post:** Gardn Labs Ltd, 4 Arno Vale Gardens, Woodthorpe, Nottingham, England, NG5 4JL

For urgent data breach concerns, please mark your email "URGENT: Data Breach" and we will respond within 72 hours.

---

*Gardn Privacy Policy v1.0*
*Gardn Labs Ltd — Company No. 17195491*
