## What changed

- Built the entire gardn-ops operations portal from scratch — new repo at `~/Documents/gardn-ops`, deployed to Vercel at `https://gardn-49k2m3aqm-trent-3296s-projects.vercel.app`. GitHub repo: `trent-cloud/gardn-ops` (private).
- **17 portal modules:** Mission Control (live Supabase metrics + NL query bar), Growth Engine (cohort retention heatmaps + regional breakdown), Revenue (MRR/ARR + unit economics), Finance (runway calculator + scenario modeller + cost breakdown + LTV/CAC + print-optimised investor view), Content Command (AI generation + Kanban with localStorage persistence + auto-publish via Buffer), Newsletter (5-section AI-drafted weekly digest), Support Centre (AI triage + approve-and-send via Resend), User Intelligence (churn risk scoring), Competitive Intel (AI analysis), Influencer Portal (CRM + AI outreach drafts), SEO Command (content gap analysis), Seasonal Intelligence (12-month UK calendar + AI weekly briefs), International Launch (7 markets with deep GTM, climate zones, influencer tiers, revenue projections), Agent Control (12-agent fleet dashboard), App Health (Supabase health + Vercel deploys + Sentry guide), Setup (8-step onboarding wizard).
- **4 API routes:** `POST /api/content/generate` (Claude-powered content in brand voice), `POST /api/query` (natural language to SQL), `POST /api/webhooks/support-inbound` (Resend webhook with AI triage), `POST /api/support/send` (approve and send via Resend).
- **12 agent system prompts** written: Sentinel, Guardian, Scribe, Weathervane, Lookout, Cultivator, Analyst, Concierge, Advocate, Ambassador, Curator, Orchestrator. Fleet manifest at `agents/FLEET.md` with data flows, guardrail tiers, and deployment schedule.
- **Supabase portal migration** ready at `supabase/migrations/20260527_portal_schema.sql` (8 tables: support_tickets, content_items, influencer_contacts, agent_runs, seo_snapshots, competitor_snapshots, newsletter_issues, daily_metrics).
- Stack: Next.js 16 + shadcn/ui + Supabase + Tailwind + Recharts + Figtree font. Fully branded with Gardn palette (forest-deep sidebar, paper background, fern/sage/warm accents).
- Solicitor sign-off on Privacy v2.0 + Terms v1.0 confirmed done (Outstanding #1 cleared).
- Pricing superseded on 2026-06-09: £6.99/mo or £49.99/yr, 7-day free trial.

## Current state

gardn-ops portal is live on Vercel (preview URL — needs `ops.gardn.world` CNAME). 17 modules built, 4 API routes functional, 12 agent system prompts ready. The portal needs Supabase service role key and Anthropic API key to light up real data and AI features. gardn-world marketing site unchanged this session.

## Next

Add env vars to Vercel (SUPABASE_SERVICE_ROLE_KEY, ANTHROPIC_API_KEY, RESEND_API_KEY), run the portal migration SQL in Supabase, set up `ops.gardn.world` CNAME, and begin deploying agents on the Mac Mini starting with Sentinel + Guardian + Scribe.

## Promote to DECISIONS?

Yes — **Pricing superseded on 2026-06-09 to £6.99/mo or £49.99/yr with 7-day free trial.** No other price points to be referenced in any code, agent prompts, or content.
