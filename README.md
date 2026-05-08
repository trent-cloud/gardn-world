# gardn-world

Marketing site for **Gardn** — the UK garden assistant. Built with Astro 5 + Tailwind CSS 4 + TypeScript and deployed to Vercel. Brand foundation (palette, typography, photography) is ported from the `gardn-native` mobile app, which is the source of truth for visual identity. Product context, ops playbooks, and roadmap live in `~/Documents/Gardn App/gardn-docs/`.

## Local development

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # production build into dist/
npm run preview  # serve the production build locally
```

## Environment

The waitlist endpoint at `src/pages/api/waitlist.ts` reads `RESEND_API_KEY` and `RESEND_AUDIENCE_ID` from env. When either is missing, it returns a graceful 503 so previews stay functional. Set them in the Vercel project for production.
