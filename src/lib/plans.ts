// ─────────────────────────────────────────────────────────────
// RendaHQ plan configuration — single source of truth for the
// platform's own subscription tiers (what we charge freelancers).
// Used by the marketing pricing, the Billing page, and plan gating.
// ─────────────────────────────────────────────────────────────

export type PlanId = "free" | "agency" | "enterprise";

// Mirrors subscriptions.status in the DB.
export type SubStatus = "trialing" | "active" | "past_due" | "canceled" | "free";

export type Provider = "stripe" | "paystack" | "flutterwave";

export interface PlanLimits {
  maxClients: number | null; // null = unlimited
  aiContractsPerMonth: number | null; // null = unlimited
  whiteLabel: boolean;
  advancedReports: boolean;
  changeOrders: boolean;
  realtimeNotifications: boolean;
  teamMembers: boolean;
}

export interface Plan {
  id: PlanId;
  name: string;
  priceUSD: number | null; // null = custom / contact sales
  period: string;
  tagline: string;
  features: string[];
  limits: PlanLimits;
}

export const AGENCY_PRICE_USD = 29;
export const YEARLY_DISCOUNT = 0.2; // 20% off when billed annually
// Full annual total after the discount (what we actually charge once a year).
export const AGENCY_YEARLY_PRICE_USD = Math.round(AGENCY_PRICE_USD * 12 * (1 - YEARLY_DISCOUNT)); // ~$278
export const TRIAL_DAYS = 14;

export type BillingCycle = "monthly" | "yearly";

// The Agency total for a given cycle, in USD.
export const agencyPriceUSD = (cycle: BillingCycle): number =>
  cycle === "yearly" ? AGENCY_YEARLY_PRICE_USD : AGENCY_PRICE_USD;

// ─── Billing-cycle preference (shared: marketing pricing → checkout) ──────────
// Persisted so the monthly/yearly choice made on the pricing page carries
// through signup to the Billing page and checkout.
const CYCLE_KEY = "rendahq_billing_cycle";
export const getBillingCycle = (): BillingCycle =>
  (typeof localStorage !== "undefined" && localStorage.getItem(CYCLE_KEY) === "yearly")
    ? "yearly"
    : "monthly";
export const saveBillingCycle = (cycle: BillingCycle): void => {
  if (typeof localStorage !== "undefined") localStorage.setItem(CYCLE_KEY, cycle);
};

export const PLANS: Record<PlanId, Plan> = {
  free: {
    id: "free",
    name: "Freelancer",
    priceUSD: 0,
    period: "forever",
    tagline: "Perfect for solo freelancers just getting started.",
    features: [
      "Up to 3 active clients",
      "Client portals",
      "AI contract builder (5/mo)",
      "Flutterwave + Stripe",
      "Basic project tracking",
    ],
    limits: {
      maxClients: 3,
      aiContractsPerMonth: 5,
      whiteLabel: false,
      advancedReports: false,
      changeOrders: false,
      realtimeNotifications: false,
      teamMembers: false,
    },
  },
  agency: {
    id: "agency",
    name: "Agency",
    priceUSD: AGENCY_PRICE_USD,
    period: "per month",
    tagline: "For growing agencies managing multiple clients.",
    features: [
      "Unlimited clients",
      "White-labeled portals",
      "Unlimited AI contracts",
      "Real-time notifications",
      "Advanced reports",
      "Multi-currency (55+ currencies)",
      "Scope change orders",
    ],
    limits: {
      maxClients: null,
      aiContractsPerMonth: null,
      whiteLabel: true,
      advancedReports: true,
      changeOrders: true,
      realtimeNotifications: true,
      teamMembers: false,
    },
  },
  enterprise: {
    id: "enterprise",
    name: "Enterprise",
    priceUSD: null,
    period: "contact us",
    tagline: "For large agencies needing custom integrations.",
    features: [
      "Everything in Agency",
      "Custom domain portal",
      "Priority support",
      "SLA guarantee",
    ],
    limits: {
      maxClients: null,
      aiContractsPerMonth: null,
      whiteLabel: true,
      advancedReports: true,
      changeOrders: true,
      realtimeNotifications: true,
      teamMembers: false, // multi-user not shipped yet; not sold on any plan
    },
  },
};

// Recurring-plan identifiers created in each provider's dashboard.
// Set these in .env.local once the plans exist provider-side.
export const PROVIDER_PLAN_REFS = {
  stripe: import.meta.env.VITE_STRIPE_AGENCY_PRICE_ID as string | undefined, // monthly price_xxx
  stripeYearly: import.meta.env.VITE_STRIPE_AGENCY_YEARLY_PRICE_ID as string | undefined, // yearly price_xxx
  flutterwave: import.meta.env.VITE_FLW_AGENCY_PLAN_ID as string | undefined, // monthly plan id
  flutterwaveYearly: import.meta.env.VITE_FLW_AGENCY_YEARLY_PLAN_ID as string | undefined, // yearly plan id
};

// Which providers are wired for subscription checkout right now.
export const SUBSCRIPTION_PROVIDERS: { id: Provider; label: string; enabled: boolean }[] = [
  { id: "stripe", label: "Card (Stripe)", enabled: true },
  { id: "flutterwave", label: "Card / Mobile Money / USSD (Flutterwave)", enabled: true },
];
