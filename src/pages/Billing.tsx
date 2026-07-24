import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Check, Loader2, Sparkles, Crown, Zap, ArrowRight, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { showError, showSuccess } from "@/utils/toast";
import { useSubscription } from "@/context/SubscriptionContext";
import { useCurrency } from "@/hooks/useCurrency";
import {
  PLANS,
  SUBSCRIPTION_PROVIDERS,
  agencyPriceUSD,
  getBillingCycle,
  saveBillingCycle,
  type PlanId,
  type Provider,
  type BillingCycle,
} from "@/lib/plans";
import { startSubscription, openBillingPortal } from "@/lib/billing";

const STATUS_LABEL: Record<string, { label: string; cls: string }> = {
  trialing: { label: "Trial", cls: "bg-amber-100 text-amber-700" },
  active: { label: "Active", cls: "bg-emerald-100 text-emerald-700" },
  past_due: { label: "Past due", cls: "bg-rose-100 text-rose-700" },
  canceled: { label: "Canceled", cls: "bg-slate-100 text-slate-600" },
  free: { label: "Free", cls: "bg-slate-100 text-slate-600" },
};

const PLAN_ICON: Record<PlanId, React.ElementType> = {
  free: Zap,
  agency: Sparkles,
  enterprise: Crown,
};

const Billing = () => {
  const { effectivePlanId, status, isTrialing, trialDaysLeft, isActive, subscription, refresh, loading } =
    useSubscription();
  const { format } = useCurrency();
  const [params, setParams] = useSearchParams();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [working, setWorking] = useState<string | null>(null);
  const [cycle, setCycle] = useState<BillingCycle>(getBillingCycle);

  // Keep the choice sticky across the app (mirrors the marketing pricing page).
  const chooseCycle = (c: BillingCycle) => {
    setCycle(c);
    saveBillingCycle(c);
  };

  // Agency total for the selected cycle, formatted in the visitor's currency.
  const agencyAmount = format(agencyPriceUSD(cycle));
  const agencyCycleLabel = cycle === "yearly" ? "/year" : "/month";

  // Handle return from a checkout redirect (Stripe/Paystack use success|cancelled;
  // Flutterwave appends successful|cancelled|failed).
  useEffect(() => {
    const s = params.get("status");
    if (!s) return;
    if (s === "success" || s === "successful" || s === "completed") {
      showSuccess("Payment received — activating your subscription…");
      refresh();
    } else if (s === "cancelled") {
      showError("Checkout cancelled. No charge was made.");
    } else if (s === "failed") {
      showError("Payment failed. Please try again.");
    }
    params.delete("status");
    params.delete("tx_ref");
    params.delete("transaction_id");
    setParams(params, { replace: true });
  }, [params, setParams, refresh]);

  const handleUpgrade = async (provider: Provider) => {
    setWorking(provider);
    const { url, error } = await startSubscription(provider, cycle);
    if (error) {
      showError(error);
      setWorking(null);
      return;
    }
    if (url) window.location.href = url;
  };

  const handlePortal = async () => {
    setWorking("portal");
    const { url, error } = await openBillingPortal();
    if (error) {
      showError(error);
      setWorking(null);
      return;
    }
    if (url) window.location.href = url;
  };

  const planOrder: PlanId[] = ["free", "agency", "enterprise"];
  const badge = STATUS_LABEL[status] ?? STATUS_LABEL.free;

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Billing & Plan</h1>
          <p className="text-slate-500 mt-1">Manage your RendaHQ subscription and payment method.</p>
        </div>

        {/* Trial banner */}
        {isTrialing && (
          <div className="flex items-center justify-between gap-4 rounded-2xl bg-amber-50 border border-amber-200 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="font-bold text-amber-900">
                  {trialDaysLeft > 0
                    ? `${trialDaysLeft} day${trialDaysLeft === 1 ? "" : "s"} left in your Agency trial`
                    : "Your trial has ended"}
                </p>
                <p className="text-sm text-amber-700">
                  Subscribe to keep unlimited clients, white-label portals, and advanced reports.
                </p>
              </div>
            </div>
            <Button
              className="bg-amber-600 hover:bg-amber-700 text-white shrink-0"
              onClick={() => setDialogOpen(true)}
            >
              Subscribe now
            </Button>
          </div>
        )}

        {/* Current plan summary */}
        <Card className="border-none shadow-sm">
          <CardContent className="p-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500 mb-1">Current plan</p>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-black text-slate-900">{PLANS[effectivePlanId].name}</span>
                <span className={cn("text-xs font-bold px-2.5 py-1 rounded-full", badge.cls)}>{badge.label}</span>
              </div>
              {subscription?.current_period_end && isActive && (
                <p className="text-sm text-slate-500 mt-1">
                  Renews {new Date(subscription.current_period_end).toLocaleDateString()}
                </p>
              )}
            </div>
            {isActive ? (
              <Button variant="outline" onClick={handlePortal} disabled={working === "portal"}>
                {working === "portal" ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>Manage billing <ExternalLink className="w-4 h-4 ml-2" /></>
                )}
              </Button>
            ) : (
              <Button
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={() => setDialogOpen(true)}
              >
                Upgrade to Agency <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Billing-cycle toggle */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-1 bg-slate-100 rounded-full p-1">
            <button
              onClick={() => chooseCycle("monthly")}
              className={cn(
                "px-5 py-1.5 rounded-full text-sm font-semibold transition-all",
                cycle === "monthly" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => chooseCycle("yearly")}
              className={cn(
                "px-5 py-1.5 rounded-full text-sm font-semibold transition-all flex items-center gap-2",
                cycle === "yearly" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              Yearly
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Plan grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {planOrder.map((id) => {
            const plan = PLANS[id];
            const Icon = PLAN_ICON[id];
            const isCurrent = effectivePlanId === id;
            const isAgency = id === "agency";
            const isEnterprise = id === "enterprise";
            return (
              <Card
                key={id}
                className={cn(
                  "border shadow-sm relative",
                  isAgency ? "border-emerald-500 border-2" : "border-slate-100"
                )}
              >
                {isAgency && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    Most popular
                  </span>
                )}
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "w-9 h-9 rounded-lg flex items-center justify-center",
                        isAgency ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-600"
                      )}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-lg text-slate-900">{plan.name}</span>
                  </div>

                  <div>
                    <span className="text-3xl font-black text-slate-900">
                      {plan.priceUSD === null
                        ? "Custom"
                        : plan.priceUSD === 0
                        ? "Free"
                        : isAgency
                        ? agencyAmount
                        : format(plan.priceUSD)}
                    </span>
                    {plan.priceUSD ? (
                      <span className="text-slate-500 text-sm">
                        {" "}
                        {isAgency ? agencyCycleLabel : `/${plan.period}`}
                      </span>
                    ) : null}
                  </div>
                  {isAgency && cycle === "yearly" && (
                    <p className="text-xs text-emerald-600 font-medium -mt-2">
                      {format(agencyPriceUSD("yearly") / 12)}/mo billed annually · save 20%
                    </p>
                  )}
                  <p className="text-sm text-slate-500">{plan.tagline}</p>

                  <ul className="space-y-2 pt-2">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <div className="pt-2">
                    {isCurrent ? (
                      <Button disabled variant="outline" className="w-full">
                        Current plan
                      </Button>
                    ) : isEnterprise ? (
                      <a href="mailto:sales@rendahq.com?subject=RendaHQ Enterprise">
                        <Button variant="outline" className="w-full">Contact sales</Button>
                      </a>
                    ) : isAgency ? (
                      <Button
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                        onClick={() => setDialogOpen(true)}
                      >
                        Upgrade
                      </Button>
                    ) : (
                      <Button disabled variant="outline" className="w-full">
                        Included
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <p className="text-center text-xs text-slate-400">
          Prices shown in your local currency are estimates; you'll be charged in the provider's settlement currency.
          Cancel anytime.
        </p>
      </div>

      {/* Provider picker */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Choose how to pay</DialogTitle>
            <DialogDescription>
              Agency plan — {agencyAmount}{agencyCycleLabel}
              {cycle === "yearly" ? " (20% off)" : ""}. Cancel anytime.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 pt-2">
            {SUBSCRIPTION_PROVIDERS.map((p) => (
              <Button
                key={p.id}
                variant="outline"
                className="w-full justify-between h-12"
                disabled={!p.enabled || working === p.id}
                onClick={() => handleUpgrade(p.id)}
              >
                <span>{p.label}</span>
                {working === p.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : p.enabled ? (
                  <ArrowRight className="w-4 h-4" />
                ) : (
                  <span className="text-xs text-slate-400">Soon</span>
                )}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Billing;
