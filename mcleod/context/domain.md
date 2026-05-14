# Domain context — Gardn World (marketing)

Who the project serves, what the offer is, and why it's worth building. Stable; updated when the answer to "what is this for?" changes.

## Who it serves

The same audience as the Gardn app — UK consumers interested in gardening — but at the *discovery* and *conversion* stage, not the in-product stage. People searching gardening queries, hitting paid social, or arriving via shared blog posts. The site converts them into waitlist signups (pre-launch) and App Store / Google Play installs (post-launch).

## What Gardn World is

Marketing and content surface for the Gardn app. Astro static site at `gardn.world`. The job is **conversion**, not product delivery. Long-form content (SEO + brand reinforcement) lives here; the product lives in `gardn-native`.

## What problem it solves

Consumer apps live or die on acquisition cost. A high-quality marketing surface that ranks organically for gardening queries — and that converts directly to app installs — is the single most leveraged thing the marketing side of Gardn can do. AI-assisted content production lets a two-person team produce volume that would normally require a content agency.

## The strategic bet

Subordinate to the £1m+ ARR target on the app side. Gardn World succeeds when Gardn the app does. Specific KPIs (traffic, install conversion, brand awareness in the UK gardening space) all roll up to that single target. The cadence here is content + SEO + conversion optimisation, not sprints and releases.

## What would kill it

- The marketing site never reaches escape velocity on traffic, leaving Gardn dependent on paid acquisition with consumer-app unit economics.
- Brand voice drift between `gardn-world` and `gardn-native` — the product story fragments across the two surfaces. Source of truth for voice + tokens is `gardn-native` (`BRAND_VOICE.md`, `src/theme/*`).

## Out of scope

- Product features — this is a marketing site, not the app.
- Analytics, Sentry, auth, CMS — none of those belong here.
- Real App Store / Play Store URLs until the listings are approved at launch.
- Anything other than `@gardnworld` social handles in the footer.
