import React, { useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/hooks/useCurrency";
import {
  ArrowRight,
  Shield,
  Zap,
  Globe,
  CreditCard,
  CheckCircle2,
  BarChart3,
  FileSignature,
  Bell,
  Users,
  FileText,
  Clock,
  Bot,
  Star,
  ChevronDown,
  Check,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

/* ─── Mini dashboard mockup rendered inline — no external images ─── */
const DashboardMockup = () => (
  <div className="rounded-2xl border border-slate-200 shadow-2xl overflow-hidden bg-white text-left select-none">
    {/* Top bar */}
    <div className="h-10 bg-slate-900 flex items-center px-4 gap-2">
      <span className="w-3 h-3 rounded-full bg-rose-400" />
      <span className="w-3 h-3 rounded-full bg-amber-400" />
      <span className="w-3 h-3 rounded-full bg-emerald-400" />
      <span className="ml-4 flex-1 h-5 bg-slate-700 rounded-md" />
    </div>
    <div className="flex h-72">
      {/* Sidebar */}
      <div className="w-40 bg-white border-r border-slate-100 p-3 space-y-1 shrink-0">
        <div className="flex items-center gap-2 px-2 py-2 mb-3">
          <div className="w-6 h-6 bg-emerald-600 rounded flex items-center justify-center">
            <span className="text-white text-xs font-black">R</span>
          </div>
          <span className="text-xs font-bold text-slate-900">RendaHQ</span>
        </div>
        {["Overview","Clients","Projects","Invoices","Contracts"].map((item, i) => (
          <div key={item} className={cn(
            "flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs",
            i === 0 ? "bg-emerald-600 text-white font-bold" : "text-slate-500"
          )}>
            <div className="w-3 h-3 rounded-sm bg-current opacity-60" />
            {item}
          </div>
        ))}
      </div>
      {/* Main */}
      <div className="flex-1 bg-slate-50 p-4 space-y-3 overflow-hidden">
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Revenue", value: "$12,400", color: "text-emerald-600" },
            { label: "Active Projects", value: "8", color: "text-emerald-600" },
            { label: "Pending Invoices", value: "$3,200", color: "text-amber-600" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl p-2.5 border border-slate-100">
              <p className="text-[9px] text-slate-400 font-medium uppercase tracking-wider">{s.label}</p>
              <p className={cn("text-sm font-black mt-0.5", s.color)}>{s.value}</p>
            </div>
          ))}
        </div>
        {/* Projects list */}
        <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
          <div className="px-3 py-2 border-b border-slate-50">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Active Projects</p>
          </div>
          {[
            { name: "Brand Identity", client: "Acme Corp", pct: 65, color: "bg-emerald-500" },
            { name: "Mobile App UI", client: "Global Tech", pct: 90, color: "bg-emerald-500" },
            { name: "E-commerce Site", client: "Zest Foods", pct: 30, color: "bg-amber-500" },
          ].map((p) => (
            <div key={p.name} className="flex items-center gap-3 px-3 py-2 border-b border-slate-50 last:border-0">
              <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center text-[8px] font-black text-emerald-600">{p.name[0]}</div>
              <div className="flex-1 min-w-0">
                <p className="text-[9px] font-bold text-slate-800 truncate">{p.name}</p>
                <p className="text-[8px] text-slate-400">{p.client}</p>
              </div>
              <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className={cn("h-full rounded-full", p.color)} style={{ width: `${p.pct}%` }} />
              </div>
              <span className="text-[8px] font-bold text-slate-500">{p.pct}%</span>
            </div>
          ))}
        </div>
        {/* Notification dot */}
        <div className="flex items-center gap-2 bg-emerald-50 rounded-xl px-3 py-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <p className="text-[9px] text-emerald-700 font-medium">Acme Corp signed the Brand Identity contract</p>
        </div>
      </div>
    </div>
  </div>
);

/* ─── Page ─── */
const FEATURES = [
  {
    icon: Globe,
    color: "bg-blue-500",
    title: "White-Labeled Client Portals",
    desc: "Every client gets a professional workspace under your brand. Share proposals, contracts, invoices, and project milestones — all in one link.",
  },
  {
    icon: Bot,
    color: "bg-emerald-500",
    title: "AI Contract Builder",
    desc: "Describe your scope in plain English. RendaHQ AI (powered by LLaMA 70B) generates a complete, professional contract in seconds.",
  },
  {
    icon: Shield,
    color: "bg-emerald-500",
    title: "Scope Change Protection",
    desc: "Formal change orders with client sign-off stop scope creep before it starts. Every scope addition is documented and priced.",
  },
  {
    icon: CreditCard,
    color: "bg-amber-500",
    title: "Paystack, Flutterwave & Stripe",
    desc: "Accept card payments via Stripe globally, or Paystack and Flutterwave for Africa — including mobile money and USSD. Clients pay directly from their portal.",
  },
  {
    icon: Bell,
    color: "bg-rose-500",
    title: "Real-Time Notifications",
    desc: "Know the instant a contract is signed, an invoice is paid, or a new client is added — live updates in your dashboard bell.",
  },
  {
    icon: BarChart3,
    color: "bg-violet-500",
    title: "Revenue & Health Reports",
    desc: "Track revenue, project health, overdue invoices, and tax summaries. 55+ currencies supported including NGN, GHS, KES, and ZAR.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Set up your agency",
    desc: "Complete the 4-step onboarding: add your agency name, choose your services, and set your preferred currency. Takes 2 minutes.",
  },
  {
    n: "02",
    title: "Add clients & projects",
    desc: "Import or create clients. Create projects with budgets, milestones, and due dates. Share a client portal link — they're in instantly.",
  },
  {
    n: "03",
    title: "Get paid automatically",
    desc: "Send an invoice from the dashboard. The client pays via Stripe, Paystack, or Flutterwave. The invoice auto-marks as Paid. You get a notification.",
  },
];

const TESTIMONIALS = [
  {
    quote: "RendaHQ replaced 4 tools I was paying for. My client relationships have never been more professional.",
    name: "Amara Osei",
    role: "Brand Strategist, Accra",
    initials: "AO",
    color: "bg-amber-100 text-amber-700",
  },
  {
    quote: "The AI contract builder alone saved me 6 hours this month. I just describe the project and it writes the whole thing.",
    name: "Temi Adeyemi",
    role: "UI/UX Designer, Lagos",
    initials: "TA",
    color: "bg-emerald-100 text-emerald-700",
  },
  {
    quote: "Finally a tool that understands Paystack and Flutterwave. My Nigerian clients can pay by card, mobile money, or USSD and I don't have to do anything.",
    name: "Kevin Mwangi",
    role: "Web Developer, Nairobi",
    initials: "KM",
    color: "bg-emerald-100 text-emerald-700",
  },
];

const PLANS = [
  {
    name: "Freelancer",
    priceUSD: 0,
    period: "forever",
    desc: "Perfect for solo freelancers just getting started.",
    cta: "Start Free",
    highlight: false,
    features: [
      "Up to 3 active clients",
      "Client portals",
      "AI contract builder (5/mo)",
      "Paystack, Flutterwave + Stripe",
      "Basic project tracking",
    ],
  },
  {
    name: "Agency",
    priceUSD: 29,
    period: "per month",
    desc: "For growing agencies managing multiple clients.",
    cta: "Start Free Trial",
    highlight: true,
    features: [
      "Unlimited clients",
      "White-labeled portals",
      "Unlimited AI contracts",
      "Real-time notifications",
      "Advanced reports",
      "Multi-currency (55+ currencies)",
      "Scope change orders",
    ],
  },
  {
    name: "Enterprise",
    priceUSD: null,
    period: "contact us",
    desc: "For large agencies needing custom integrations.",
    cta: "Contact Sales",
    highlight: false,
    features: [
      "Everything in Agency",
      "Custom domain portal",
      "Priority support",
      "Team member accounts",
      "API access",
      "SLA guarantee",
    ],
  },
];

const BASE_PRICE_USD = 29;

const Index = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { format, currency } = useCurrency();
  const [rates, setRates] = useState<Record<string, number> | null>(null);

  React.useEffect(() => {
    fetch('https://open.er-api.com/v6/latest/USD')
      .then((r) => r.json())
      .then((data) => { if (data?.rates) setRates(data.rates); })
      .catch(() => {}); // silently fall back to raw USD display
  }, []);

  const agencyPrice = (() => {
    if (currency.code === 'USD' || !rates) return format(BASE_PRICE_USD);
    const rate = rates[currency.code];
    if (!rate) return `$${BASE_PRICE_USD}`;
    // Round to a locally sensible number
    const converted = BASE_PRICE_USD * rate;
    const rounded = converted < 100
      ? Math.round(converted * 10) / 10          // e.g. €27.2
      : converted < 1000
      ? Math.round(converted / 5) * 5            // e.g. ₵360
      : Math.round(converted / 100) * 100;       // e.g. ₦49,300 → ₦49,300
    return format(rounded);
  })();

  return (
    <div className="min-h-screen bg-white selection:bg-emerald-100 overflow-x-hidden">

      {/* ── Nav ── */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <img src="/rendahq-logo.png" alt="RendaHQ" className="h-9 w-auto" />
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-emerald-600 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-emerald-600 transition-colors">How it works</a>
            <a href="#pricing" className="hover:text-emerald-600 transition-colors">Pricing</a>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link to="/signin">
              <Button variant="ghost" className="text-slate-600 font-medium">Sign In</Button>
            </Link>
            <Link to="/signin">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 shadow-lg shadow-emerald-100">
                Get Started Free
              </Button>
            </Link>
          </div>

          <button className="md:hidden p-2 text-slate-600" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white px-6 py-4 space-y-3">
            <a href="#features" className="block text-sm font-medium text-slate-600 py-2" onClick={() => setMenuOpen(false)}>Features</a>
            <a href="#how-it-works" className="block text-sm font-medium text-slate-600 py-2" onClick={() => setMenuOpen(false)}>How it works</a>
            <a href="#pricing" className="block text-sm font-medium text-slate-600 py-2" onClick={() => setMenuOpen(false)}>Pricing</a>
            <Link to="/signin" className="block">
              <Button className="w-full bg-emerald-600 text-white mt-2">Get Started Free</Button>
            </Link>
          </div>
        )}
      </nav>

      {/* ── Hero ── */}
      <section className="pt-20 pb-28 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <a href="#features" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 text-sm font-bold mb-8 hover:bg-emerald-100 transition-colors">
            <Zap className="w-4 h-4" />
            Now with real-time notifications + Stripe payments
            <ArrowRight className="w-3 h-3" />
          </a>

          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight mb-6 leading-[1.05]">
            Run your agency.<br />
            <span className="text-emerald-600">Not your spreadsheets.</span>
          </h1>

          <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            RendaHQ replaces Notion, DocuSign, Stripe, and your project tracker with a single AI-powered workspace.
            Client portals, contracts, invoicing, and payments — built for agencies in Africa and beyond.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <Link to="/signin">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 h-14 text-base rounded-2xl shadow-xl shadow-emerald-200 gap-2 group">
                Start for free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <a href="#how-it-works">
              <Button size="lg" variant="outline" className="h-14 px-8 text-base rounded-2xl border-slate-200 text-slate-600 hover:bg-slate-50 gap-2">
                See how it works
                <ChevronDown className="w-4 h-4" />
              </Button>
            </a>
          </div>

          {/* Social proof bar */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-slate-500">
            {[
              { val: "500+", label: "agencies using RendaHQ" },
              { val: "55+", label: "currencies supported" },
              { val: "Free", label: "to get started" },
              { val: "2 min", label: "to onboard" },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-2">
                <span className="font-black text-slate-900">{s.val}</span>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Inline dashboard mockup */}
        <div className="relative max-w-4xl mx-auto">
          <div className="absolute inset-0 bg-emerald-600/10 blur-3xl rounded-full -z-10 scale-90" />
          <DashboardMockup />
        </div>
      </section>

      {/* ── Problem ── */}
      <section className="py-24 bg-slate-900 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-emerald-400 font-bold uppercase tracking-widest text-sm mb-4">The freelancer tax</p>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
            You're running your agency<br />on 6 different tools
          </h2>
          <p className="text-slate-400 text-lg mb-14 max-w-2xl mx-auto">
            Notion for docs. Calendly for scheduling. DocuSign for contracts. Stripe for payments. Excel for invoices. WhatsApp for client updates.
            It's a mess — and you're paying for all of it.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 max-w-3xl mx-auto mb-14">
            {["Notion", "DocuSign", "Stripe", "Calendly", "Excel", "WhatsApp"].map((tool) => (
              <div key={tool} className="bg-white/5 rounded-2xl px-4 py-3 text-slate-400 text-sm font-medium line-through decoration-rose-500">
                {tool}
              </div>
            ))}
          </div>
          <div className="inline-flex items-center gap-3 bg-emerald-600 rounded-2xl px-8 py-4">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-lg">R</span>
            </div>
            <span className="text-white font-bold text-lg">RendaHQ replaces all of them</span>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-32 bg-slate-50 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-emerald-600 font-bold uppercase tracking-widest text-sm mb-3">Features</p>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">Everything in one workspace</h2>
            <p className="text-slate-500 max-w-xl mx-auto text-lg">
              Every feature your agency needs — built together, not bolted on.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all group">
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg", f.color)}>
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">{f.title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" className="py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-emerald-600 font-bold uppercase tracking-widest text-sm mb-3">How it works</p>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">Up and running in minutes</h2>
            <p className="text-slate-500 max-w-xl mx-auto text-lg">
              No complex setup. No CSV imports. Just answer a few questions and start working.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map((step, i) => (
              <div key={step.n} className="relative">
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-full w-full h-px bg-slate-200 -translate-x-4 z-0" />
                )}
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-200">
                    <span className="text-white font-black text-xl">{step.n}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3">{step.title}</h3>
                  <p className="text-slate-500 leading-relaxed text-sm">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-24 bg-slate-50 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-emerald-600 font-bold uppercase tracking-widest text-sm mb-3">Testimonials</p>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900">Agencies love RendaHQ</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <blockquote className="text-slate-700 leading-relaxed mb-8 text-sm">
                  "{t.quote}"
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className={cn("w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm", t.color)}>
                    {t.initials}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{t.name}</p>
                    <p className="text-slate-500 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-emerald-600 font-bold uppercase tracking-widest text-sm mb-3">Pricing</p>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">Simple, honest pricing</h2>
            <p className="text-slate-500 max-w-xl mx-auto text-lg">
              Start free. Upgrade when you're ready. No hidden fees, no contracts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {PLANS.map((plan) => (
              <div key={plan.name} className={cn(
                "rounded-3xl p-8 border transition-all",
                plan.highlight
                  ? "bg-emerald-600 border-emerald-600 shadow-2xl shadow-emerald-200 scale-105"
                  : "bg-white border-slate-200 shadow-sm"
              )}>
                {plan.highlight && (
                  <div className="inline-flex items-center gap-1 bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
                    <Star className="w-3 h-3 fill-white" /> Most Popular
                  </div>
                )}
                <h3 className={cn("text-lg font-bold mb-1", plan.highlight ? "text-white" : "text-slate-900")}>
                  {plan.name}
                </h3>
                <p className={cn("text-sm mb-6", plan.highlight ? "text-emerald-200" : "text-slate-500")}>
                  {plan.desc}
                </p>
                <div className="flex items-end gap-1 mb-2">
                  <span className={cn("text-5xl font-black", plan.highlight ? "text-white" : "text-slate-900")}>
                    {plan.priceUSD === null
                      ? "Custom"
                      : plan.priceUSD === 0
                      ? "Free"
                      : agencyPrice}
                  </span>
                  <span className={cn("text-sm mb-2", plan.highlight ? "text-emerald-200" : "text-slate-400")}>
                    {plan.priceUSD !== null && plan.priceUSD > 0 && `/${plan.period}`}
                  </span>
                </div>
                {plan.priceUSD !== null && plan.priceUSD > 0 && currency.code !== "USD" && (
                  <p className={cn("text-xs mb-6", plan.highlight ? "text-emerald-300" : "text-slate-400")}>
                    ≈ USD $29/mo · billed in USD
                  </p>
                )}
                {!(plan.priceUSD !== null && plan.priceUSD > 0 && currency.code !== "USD") && (
                  <div className="mb-6" />
                )}
                <Link to="/signin">
                  <Button className={cn(
                    "w-full rounded-xl mb-8 h-11",
                    plan.highlight
                      ? "bg-white text-emerald-600 hover:bg-emerald-50"
                      : "bg-emerald-600 text-white hover:bg-emerald-700"
                  )}>
                    {plan.cta}
                  </Button>
                </Link>
                <ul className="space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <Check className={cn("w-4 h-4 shrink-0 mt-0.5", plan.highlight ? "text-emerald-200" : "text-emerald-600")} />
                      <span className={cn("text-sm", plan.highlight ? "text-emerald-100" : "text-slate-600")}>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto bg-slate-900 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-emerald-400 font-bold uppercase tracking-widest text-sm mb-4">Get started today</p>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
              Your agency deserves<br />better tools
            </h2>
            <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">
              Join 500+ freelancers and agencies across Africa who run their entire business on RendaHQ. Free to start, no credit card required.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/signin">
                <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 px-10 h-14 text-base rounded-2xl font-bold gap-2 group">
                  Start for free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
          <div className="absolute inset-0 bg-emerald-600/10" />
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-600/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-violet-600/20 rounded-full blur-3xl" />
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-16 border-t border-slate-100 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start justify-between gap-12 mb-12">
            <div className="max-w-xs">
              <img src="/rendahq-logo.png" alt="RendaHQ" className="h-9 w-auto mb-4" />
              <p className="text-slate-900 font-bold text-sm mb-2">Build. Bill. Get paid.</p>
              <p className="text-slate-500 text-sm leading-relaxed">
                The Business OS for freelancers and agencies in Africa and beyond. AI-powered, payment-ready, client-friendly.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-sm">
              <div>
                <p className="font-bold text-slate-900 mb-4">Product</p>
                <ul className="space-y-2 text-slate-500">
                  <li><a href="#features" className="hover:text-emerald-600 transition-colors">Features</a></li>
                  <li><a href="#pricing" className="hover:text-emerald-600 transition-colors">Pricing</a></li>
                  <li><a href="#how-it-works" className="hover:text-emerald-600 transition-colors">How it works</a></li>
                </ul>
              </div>
              <div>
                <p className="font-bold text-slate-900 mb-4">Platform</p>
                <ul className="space-y-2 text-slate-500">
                  <li><Link to="/signin" className="hover:text-emerald-600 transition-colors">Sign In</Link></li>
                  <li><Link to="/signin" className="hover:text-emerald-600 transition-colors">Create Account</Link></li>
                  <li><Link to="/dashboard" className="hover:text-emerald-600 transition-colors">Dashboard</Link></li>
                </ul>
              </div>
              <div>
                <p className="font-bold text-slate-900 mb-4">Payments</p>
                <ul className="space-y-2 text-slate-500">
                  <li><span>Stripe</span></li>
                  <li><span>Paystack</span></li>
                  <li><span>Flutterwave</span></li>
                  <li><span>55+ currencies</span></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-slate-100 gap-4">
            <p className="text-slate-400 text-sm">© {new Date().getFullYear()} RendaHQ OS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
