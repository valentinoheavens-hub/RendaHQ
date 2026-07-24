# RendaHQ — subscription billing setup (Stripe + Flutterwave)

How to make RendaHQ charge freelancers for the **Agency plan** ($29/mo, or
$278/yr at 20% off). Everything below is provider-side config plus a set of
**Edge Function secrets** — no code changes needed.

**Where secrets go:** Supabase Dashboard → **Edge Functions → Secrets**
(a.k.a. "Function Secrets"). These are server-only and never shipped to the
browser. `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY`
are injected automatically — you do **not** set those.

**The one public key** (safe to expose) lives in `netlify.toml`, not here:
`VITE_FLUTTERWAVE_PUBLIC_KEY`. Never put a secret/`sk_`/`FLWSECK` key in Netlify
or any `VITE_` variable — those are baked into the public bundle.

---

## Status checklist

| Secret | Purpose | Status |
|---|---|---|
| `STRIPE_SECRET_KEY` | Stripe API (`sk_live_…`) | ⬜ set it |
| `STRIPE_AGENCY_PRICE_ID` | Monthly Agency price (`price_…`) | ⬜ set it |
| `STRIPE_AGENCY_YEARLY_PRICE_ID` | **Yearly** Agency price (`price_…`) | ⬜ set it |
| `STRIPE_SUB_WEBHOOK_SECRET` | Verifies subscription webhook (`whsec_…`) | ⬜ set it |
| `FLW_SECRET_KEY` | Flutterwave API (`FLWSECK-…`) | ⬜ set it |
| `FLW_AGENCY_PLAN_ID` | Monthly Flutterwave Payment Plan id | ⬜ set it |
| `FLW_AGENCY_YEARLY_PLAN_ID` | **Yearly** Flutterwave Payment Plan id | ⬜ set it |
| `FLW_AGENCY_YEARLY_AMOUNT` | Yearly amount, must match the plan (`278`) | ⬜ set it |
| `FLW_WEBHOOK_HASH` | Verifies Flutterwave webhook (`verif-hash`) | ⬜ set it |
| `FLW_AGENCY_AMOUNT` | Monthly amount (optional, defaults to `29`) | ➖ optional |
| `FLW_AGENCY_CURRENCY` | Charge currency (optional, defaults to `USD`) | ➖ optional |
| `RESEND_API_KEY` / `RESEND_FROM` | Transactional email — see `email-domain-setup.md` | ↗ separate |
| `GROQ_API_KEY` | AI proposals/contracts (`ai-proxy`) | ↗ separate |

> The `43f25432-…` UUID you had earlier is almost certainly the Flutterwave
> **webhook verification hash** → set it as `FLW_WEBHOOK_HASH` (confirm in
> Flutterwave → Settings → Webhooks).

---

## Stripe

### 1. Create the two Agency prices
Stripe Dashboard → **Product catalog → Add product** → "RendaHQ Agency". Add
**two recurring prices** on that product:

| Price | Billing period | Amount |
|---|---|---|
| Monthly | Monthly | **$29.00** |
| Yearly | Yearly | **$278.00** (20% off $348) |

Copy each price's `price_…` id.

### 2. Set the secrets
```
STRIPE_SECRET_KEY             = sk_live_…
STRIPE_AGENCY_PRICE_ID        = price_…   (the monthly one)
STRIPE_AGENCY_YEARLY_PRICE_ID = price_…   (the yearly one)
```
The `subscribe-stripe` function picks the yearly price when the user chose
"Yearly", and falls back to the monthly price if the yearly one is unset.

### 3. Subscription webhook
Stripe → **Developers → Webhooks → Add endpoint**:
- URL: `https://uhpfpecvzgmhsimegfkn.supabase.co/functions/v1/stripe-sub-webhook`
- Events: `checkout.session.completed`, `customer.subscription.updated`,
  `customer.subscription.deleted` (the three the `stripe-sub-webhook` function handles)
- Copy the signing secret → `STRIPE_SUB_WEBHOOK_SECRET = whsec_…`

---

## Flutterwave

### 1. Create the two Payment Plans
Flutterwave Dashboard → **Payment Plans → Create Plan**. Make two:

| Plan | Interval | Amount |
|---|---|---|
| Agency Monthly | Monthly | **29 USD** |
| Agency Yearly | Yearly / Annually | **278 USD** |

Copy each plan's numeric **Plan ID**.

### 2. Set the secrets
```
FLW_SECRET_KEY            = FLWSECK-…
FLW_AGENCY_PLAN_ID        = 12345    (monthly plan id)
FLW_AGENCY_YEARLY_PLAN_ID = 67890    (yearly plan id)
FLW_AGENCY_YEARLY_AMOUNT  = 278      (must equal the yearly plan amount)
# optional — only if you charge something other than the defaults:
# FLW_AGENCY_AMOUNT   = 29
# FLW_AGENCY_CURRENCY = USD
```
`subscribe-flutterwave` picks the yearly plan + amount when the user chose
"Yearly", and falls back to the monthly plan if the yearly one is unset.

### 3. Webhook
Flutterwave → **Settings → Webhooks**:
- URL: `https://uhpfpecvzgmhsimegfkn.supabase.co/functions/v1/flutterwave-sub-webhook`
- Set a **Secret hash** → same value as `FLW_WEBHOOK_HASH`.

---

## How the yearly choice flows through

1. Visitor toggles **Yearly** on the pricing page → stored as
   `rendahq_billing_cycle` in their browser.
2. The Billing page reads it, shows the annual total, and passes
   `billingCycle: "yearly"` to `startSubscription`.
3. `subscribe-stripe` / `subscribe-flutterwave` select the **yearly**
   price/plan above. If the yearly ids aren't set yet, checkout still works —
   it just charges the **monthly** price. So set the yearly ids before
   advertising annual billing as live.

---

## Deprecated

Paystack was removed from the product. The `subscribe-paystack` /
`paystack-sub-webhook` functions and `PAYSTACK_*` secrets are unused — ignore
them (or delete the functions later).

## Test
1. Sign in → **Billing** → toggle **Yearly** → **Upgrade** → pick a provider.
2. Confirm the hosted checkout shows the **annual** amount ($278 / local
   equivalent), not $29.
3. Complete a test payment; the webhook flips the subscription to `active` and
   the Billing page shows the renewal date.
