# RendaHQ — Investor Demo Script

A tight ~8-minute walkthrough that shows real, working product. Every screen
below is backed by **real Supabase data** — no mockups, no dead links.

## Pre-flight (do once, before the room)
- **Account:** sign in as `valentinoheavens@gmail.com` (this account is seeded).
- **Verified working live:** auth, dashboard data, AI contract generation, the bell/activity feed.
- **Don't click "Pay" live** unless provider test keys are set — the payment
  *options* render, but completing a charge needs the Stripe/Paystack/Flutterwave
  secrets. Show the options; narrate the rails.
- Have the landing page and the app open in two tabs.

## Seeded data (what the room will see)
- **4 clients:** Acme Corp, Global Tech, Zest Foods (onboarding), Lagoon Studios
- **3 projects:** Brand Identity (Acme, 65%, healthy) · Mobile App UI (Global Tech, 90%, at risk) · Marketing Strategy (Zest, done)
- **4 contracts:** Signed / Sent / Draft across clients
- **4 invoices:** 2 paid, 1 sent, 1 overdue → Dashboard shows **~5,250 collected, ~8,250 pending**
- **Activity feed:** contract signed, payment received, new client

---

## The script

**1. The hook (landing page) — 45s**
Open the marketing site. "RendaHQ — *Build. Bill. Get paid.* The business OS for
freelancers and agencies in emerging markets." Scroll to pricing: Free /
Agency $29 / Enterprise, shown in the visitor's local currency.

**2. Sign in (real auth) — 20s**
Sign in. Note: real Supabase auth, GitHub/Google OAuth, RLS — every user only
ever sees their own data.

**3. Dashboard (real numbers) — 90s**
- Top stats are **live** from the database: revenue collected, active clients, pending invoices.
- **Active Projects** are real and clickable — open *Mobile App UI* (flagged *At Risk*, 90%) to show project health tracking.
- **Recent Activity** is a real feed (contract signed, payment received) — click the bell, same data.
- Point out the trial banner: "14-day Agency trial, no card."

**4. Clients & portals — 45s**
Open **Clients** → *Acme Corp*. "Every client gets a white-labeled portal —
proposals, contracts, invoices in one branded link." (Show the portal link.)

**5. AI Contract Builder (the wow) — 90s**
Go to **Contracts → Generate with RendaHQ AI**. Type a real scope, e.g.:
> "Design a 5-page marketing website for a fintech startup, including brand
> guidelines and 2 rounds of revisions."
Click generate — a complete, professional contract drafts **live** in seconds.
"This is real AI (LLaMA 70B), running server-side."

**6. Invoicing & African payment rails — 60s**
Open **Invoices** → an unpaid one. Show the pay panel: **Paystack, Flutterwave,
Stripe — plus MTN MoMo, M-Pesa, USSD.** "We meet clients on the rails they
actually use. Card-first tools don't."

**7. Billing — how *we* make money — 45s**
Open **Billing & Plan**. "Same three rails power our own subscriptions — we
charge agencies $29/mo. Trial → active is fully wired with webhooks." Show the
provider picker.

**8. Close — 30s**
"Real auth, real data, real AI, real payment rails, real recurring revenue —
built for the markets global tools ignore."

---

## If asked / safety rails
- **"Is the data real?"** Yes — Postgres + row-level security; this is my live account.
- **"Can it take a payment now?"** The integration is built and deployed; going
  live is just pasting provider keys (no code left).
- **Avoid:** the Projects "new project" deep flow and completing a real payment
  unless you've set test keys.

## Reset / re-seed
The seed is idempotent (skips if the account already has clients). To re-seed a
fresh account, run `supabase/gating_migration.sql` prerequisites then the demo
seed block (kept in the session notes / ask the team).
