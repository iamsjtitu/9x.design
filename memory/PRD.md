# 9x.design Studio — PRD

## Original problem statement (user)
> https://github.com/iamsjtitu/9x-design-studio  
> ye maine banaya tha, ismai meko aur improvement chahiye  
> GitHub repo ko clone/explore karo — 9x.Design web designing aur software development provide karta hai, design sahi hai  
> dark mode mat dalna abhi ka design perfect hai, mail: sales@9x.design ana chahiye

## Repo
Original: https://github.com/iamsjtitu/9x-design-studio (Vite + React + TS + Tailwind)

## Tech stack (current)
- Frontend: Vite 5 + React 18 + TypeScript + Tailwind 3 (replaces default CRA in /app/frontend)
- Backend: FastAPI + Motor + MongoDB + Resend (email)
- Supervisor: frontend=`yarn start` (runs Vite on 0.0.0.0:3000), backend=`uvicorn server:app :8001`
- Env:
  - `/app/frontend/.env` — REACT_APP_BACKEND_URL, VITE_BACKEND_URL, WDS_SOCKET_PORT, ENABLE_HEALTH_CHECK
  - `/app/backend/.env` — MONGO_URL, DB_NAME=nine_x_design, RESEND_API_KEY (empty), SENDER_EMAIL, RECEIVER_EMAIL=sales@9x.design

## User personas
- P1 — Agency visitors (founders, PMs) scanning services, prices & portfolio before booking a call
- P2 — 9x.design team (sales) receiving lead notifications at sales@9x.design
- P3 — India-based leads who prefer WhatsApp over email

## Core requirements (static)
- Full-service agency landing site covering: Web, Software, Mobile app, UI/UX
- Working lead capture (contact form → MongoDB + email notification to sales@)
- Keep existing orange-on-light design (no dark mode — explicit user ask)
- All email notifications should land at sales@9x.design

## Implemented so far

### Session 1 — 2026-01-23
- Ported original Vite+React+TS repo into Emergent `/app/frontend`; configured `yarn start` → vite on `:3000`
- Kept all existing components (Hero, Stats, Services, Process, Testimonials, Footer) — design preserved
- Backend: `POST /api/contact` saves lead to Mongo (`nine_x_design.leads`) and sends HTML email via Resend; `GET /api/leads` for admin; `GET /api/health`
- Email template: branded HTML (gradient header, reply-to=lead email, html-escaped user input)
- **New components:**
  - `ClientLogos.tsx` — marquee of 12 "trusted by" marks
  - `TechStack.tsx` — two-row counter-scrolling marquee with 18 tech pills
  - `Pricing.tsx` — 3-tier pricing (Starter / Growth highlighted / Enterprise) with features + CTAs
  - `FAQ.tsx` — 8 accordion items (timelines, team fit, process, ownership, support, existing team, payments, NDA)
  - `WhatsAppButton.tsx` — floating CTA appearing after 400px scroll with auto-dismiss tooltip
  - `Portfolio.tsx` — rebuilt with case-study modal (challenge / solution / measurable results) for 6 projects
  - `Contact.tsx` — real API submission with loading / success / error states, added Company + Budget fields, client-side validation (minLength textarea)
  - `Navbar.tsx` — added Pricing + FAQ links, all interactive elements get data-testid
  - `Footer.tsx` — sales@9x.design email, Pricing/FAQ footer links, WhatsApp link
- SEO: expanded `<title>`, `<meta description>`, OG tags, Twitter card, JSON-LD ProfessionalService schema, canonical link
- Tested end-to-end: 9/9 backend pytest + manual frontend walkthrough (form submit verified, modal verified, WhatsApp verified)

### Session 2 — 2026-01-23
- **RESEND_API_KEY** configured with user-provided key (re_FS8RA...)
- Resend is in **testing mode** — owner's verified email is `iamsjtitu@gmail.com`. Leads are temporarily routed to this inbox.
- `.env` now has `TARGET_EMAIL_AFTER_DOMAIN_VERIFY=sales@9x.design` as a reminder of the production target.
- Verified email delivery end-to-end — Rahul Sharma lead sent successfully, `email_sent=true` in DB, Resend returned a message id.
- **Footer socials** updated to Twitter, Instagram, Facebook (removed LinkedIn + GitHub per user request). Handles:
  - https://twitter.com/9xdesign
  - https://instagram.com/9x.design
  - https://facebook.com/9x.design
- `index.html` JSON-LD `sameAs` schema updated to match new socials.

## Prioritized backlog (P0 → P2)
- P0 — User must verify `9x.design` domain at https://resend.com/domains, then update `.env`:
  - Change `SENDER_EMAIL` from `onboarding@resend.dev` → `hello@9x.design` (or similar)
  - Change `RECEIVER_EMAIL` from `iamsjtitu@gmail.com` → `sales@9x.design`
  - Restart backend → leads will route to sales@9x.design
- P1 — Protect `/api/leads` with simple admin auth before production
- P1 — Build `/admin` dashboard UI (user expressed interest)
- P1 — Real portfolio data + real client logos (replace Unsplash stock + generic names)
- P1 — Rate-limit `/api/contact` (honeypot + IP throttle)
- P2 — Live chat / Calendly booking integration
- P2 — Blog / case-study pages with shareable URLs
- P2 — Analytics (GA4 / Plausible)

## Not in scope
- Dark mode (explicitly deferred by user — "design perfect hai")
- Full admin CRM UI
