"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, ArrowLeft, Check, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { profileStore } from "@/lib/profileStore";
import { saveCurrencyCode, CURRENCIES as currencies } from "@/lib/currency";
import { showError } from "@/utils/toast";

const SERVICES = [
  "Brand Design",
  "UI/UX Design",
  "Web Development",
  "Mobile Development",
  "Marketing Strategy",
  "Content Creation",
  "Photography",
  "Video Production",
  "Consulting",
  "SEO & Growth",
  "Social Media",
  "Copywriting",
];

const STEPS = ["Your Agency", "Services", "Currency", "Launch"];

const Onboarding = () => {
  const navigate = useNavigate();
  const { user, refreshProfile } = useAuth();

  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);

  const [fullName, setFullName] = useState(
    user?.user_metadata?.full_name ?? ""
  );
  const [agencyName, setAgencyName] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [currencyCode, setCurrencyCode] = useState("USD");

  const toggleService = (s: string) => {
    setSelectedServices((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  const handleNext = () => {
    if (step === 0 && !agencyName.trim()) {
      showError("Please enter your agency name.");
      return;
    }
    if (step === 1 && selectedServices.length === 0) {
      showError("Pick at least one service.");
      return;
    }
    setStep((s) => s + 1);
  };

  const handleFinish = async () => {
    if (!user) return;
    setSaving(true);
    try {
      saveCurrencyCode(currencyCode);
      await profileStore.update(user.id, {
        full_name: fullName,
        agency_name: agencyName,
        currency_code: currencyCode,
        services: selectedServices,
        onboarding_completed: true,
      });
      await refreshProfile();
      navigate("/dashboard");
    } catch {
      showError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      {/* Logo */}
      <div className="flex flex-col items-center gap-2 mb-12">
        <img src="/rendahq-logo.png" alt="RendaHQ" className="h-11 w-auto" />
        <p className="text-slate-400 font-medium text-sm">Build. Bill. Get paid.</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-3 mb-10">
        {STEPS.map((label, i) => (
          <React.Fragment key={label}>
            <div className="flex flex-col items-center gap-1">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all",
                i < step ? "bg-emerald-600 text-white" :
                i === step ? "bg-emerald-600 text-white ring-4 ring-emerald-100" :
                "bg-slate-200 text-slate-400"
              )}>
                {i < step ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span className={cn(
                "text-xs font-medium hidden sm:block",
                i === step ? "text-emerald-600" : "text-slate-400"
              )}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={cn(
                "h-0.5 w-12 rounded-full mb-4 transition-all",
                i < step ? "bg-emerald-600" : "bg-slate-200"
              )} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Card */}
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl shadow-slate-100 p-8">

        {/* Step 0 — Agency details */}
        {step === 0 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900">Welcome to RendaHQ</h2>
              <p className="text-slate-500 mt-1">Let's set up your workspace in 2 minutes.</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="full-name">Your Name</Label>
                <Input
                  id="full-name"
                  placeholder="e.g. Felix Kimani"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="agency-name">Agency / Business Name *</Label>
                <Input
                  id="agency-name"
                  placeholder="e.g. Studio Pixel, Felix Creative"
                  value={agencyName}
                  onChange={(e) => setAgencyName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleNext()}
                  autoFocus
                />
                <p className="text-xs text-slate-400">
                  This appears on your invoices, proposals, and client portal.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Step 1 — Services */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900">What do you offer?</h2>
              <p className="text-slate-500 mt-1">
                Select all services you provide. RendaHQ AI will tailor suggestions for you.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {SERVICES.map((s) => {
                const active = selectedServices.includes(s);
                return (
                  <button
                    key={s}
                    onClick={() => toggleService(s)}
                    className={cn(
                      "px-3 py-2.5 rounded-xl text-sm font-medium border-2 transition-all text-left",
                      active
                        ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                        : "border-slate-200 bg-white text-slate-600 hover:border-emerald-300"
                    )}
                  >
                    {active && <Check className="w-3 h-3 inline mr-1.5 text-emerald-600" />}
                    {s}
                  </button>
                );
              })}
            </div>
            {selectedServices.length > 0 && (
              <p className="text-xs text-emerald-500 font-medium">
                {selectedServices.length} service{selectedServices.length !== 1 ? "s" : ""} selected
              </p>
            )}
          </div>
        )}

        {/* Step 2 — Currency */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900">Your billing currency</h2>
              <p className="text-slate-500 mt-1">
                This sets the default on all your invoices and proposals. You can change it anytime in Settings.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {currencies.map((c) => {
                const active = currencyCode === c.code;
                return (
                  <button
                    key={c.code}
                    onClick={() => setCurrencyCode(c.code)}
                    className={cn(
                      "px-4 py-3 rounded-xl border-2 text-left transition-all",
                      active
                        ? "border-emerald-600 bg-emerald-50"
                        : "border-slate-200 bg-white hover:border-emerald-300"
                    )}
                  >
                    <span className="text-lg font-bold mr-2">{c.symbol}</span>
                    <span className={cn("text-sm font-medium", active ? "text-emerald-700" : "text-slate-600")}>
                      {c.code} — {c.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3 — Launch */}
        {step === 3 && (
          <div className="space-y-6 text-center py-4">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
              <Sparkles className="w-10 h-10 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900">You're all set, {fullName.split(" ")[0] || "there"}!</h2>
              <p className="text-slate-500 mt-2 leading-relaxed">
                <strong className="text-slate-700">{agencyName}</strong> is ready to go.
                Your dashboard is waiting — clients, invoices, contracts, and RendaHQ AI are all live.
              </p>
            </div>
            <div className="bg-slate-50 rounded-2xl p-4 text-left space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Your setup</p>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Agency</span>
                <span className="font-bold text-slate-900">{agencyName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Services</span>
                <span className="font-bold text-slate-900">{selectedServices.length} selected</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Currency</span>
                <span className="font-bold text-slate-900">{currencyCode}</span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-3 mt-8">
          {step > 0 && step < 3 && (
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => setStep((s) => s - 1)}
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>
          )}
          <div className="flex-1" />
          {step < 3 ? (
            <Button
              className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 px-6"
              onClick={handleNext}
            >
              Continue <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 px-8"
              onClick={handleFinish}
              disabled={saving}
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              {saving ? "Setting up…" : "Launch My Dashboard"}
            </Button>
          )}
        </div>
      </div>

      <p className="text-xs text-slate-400 mt-8">
        You can update all of this later in Settings.
      </p>
    </div>
  );
};

export default Onboarding;
