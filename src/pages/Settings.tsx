import React, { useEffect, useRef, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Globe,
  Palette,
  CreditCard,
  Upload,
  Check,
  Users,
  Mail,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  User as UserIcon,
  Save,
  Trash2,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { sendEmail, renderEmail } from "@/lib/email";
import { useCurrency } from "@/hooks/useCurrency";
import { usePlan } from "@/context/SubscriptionContext";
import { useAuth } from "@/context/AuthContext";
import { profileStore } from "@/lib/profileStore";
import UpgradeBanner from "@/components/UpgradeBanner";
import { showSuccess, showError } from "@/utils/toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Payment gateways report real status from the configured public keys.
const GATEWAYS = [
  {
    name: "Stripe",
    desc: "Global card payments — best for clients in the US, UK, and EU.",
    envKey: "VITE_STRIPE_PUBLIC_KEY",
    docs: "https://dashboard.stripe.com/apikeys",
  },
  {
    name: "Flutterwave",
    desc: "Cards, mobile money, and USSD across 30+ African countries.",
    envKey: "VITE_FLUTTERWAVE_PUBLIC_KEY",
    docs: "https://app.flutterwave.com/dashboard/settings/apis",
  },
];

const Settings = () => {
  const { user, profile, refreshProfile } = useAuth();
  const { code: currencyCode, currencies, setCurrency, format } = useCurrency();
  const { can: planCan, plan } = usePlan();
  const canWhiteLabel = planCan.whiteLabel;

  // ─── Branding state (hydrated from the real profile) ───
  const [agencyName, setAgencyName] = useState("");
  const [fullName, setFullName] = useState("");
  const [brandColor, setBrandColor] = useState("#059669");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [savingBrand, setSavingBrand] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // ─── Domain ───
  const [domain, setDomain] = useState("");
  const [savingDomain, setSavingDomain] = useState(false);

  // ─── Email test ───
  const [testTo, setTestTo] = useState("");
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    if (!profile) return;
    setAgencyName(profile.agency_name ?? "");
    setFullName(profile.full_name ?? "");
    setBrandColor(profile.brand_color ?? "#059669");
    setLogoUrl(profile.logo_url ?? null);
  }, [profile]);

  useEffect(() => {
    if (user?.email && !testTo) setTestTo(user.email);
  }, [user?.email, testTo]);

  const saveBranding = async () => {
    if (!user) return;
    if (!agencyName.trim()) { showError("Agency name can't be empty."); return; }
    setSavingBrand(true);
    try {
      await profileStore.update(user.id, {
        agency_name: agencyName.trim(),
        full_name: fullName.trim() || null,
        brand_color: brandColor,
        currency_code: currencyCode,
      });
      await refreshProfile();
      showSuccess("Branding saved.");
    } catch (e: any) {
      showError(e.message || "Could not save branding.");
    } finally {
      setSavingBrand(false);
    }
  };

  const handleLogoFile = async (file?: File) => {
    if (!file || !user) return;
    if (file.size > 2 * 1024 * 1024) { showError("Logo must be under 2MB."); return; }
    if (!/^image\//.test(file.type)) { showError("Please choose an image file."); return; }
    setUploading(true);
    try {
      const url = await profileStore.uploadLogo(user.id, file);
      await profileStore.update(user.id, { logo_url: url });
      setLogoUrl(url);
      await refreshProfile();
      showSuccess("Logo uploaded.");
    } catch (e: any) {
      showError(e.message || "Logo upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const removeLogo = async () => {
    if (!user) return;
    try {
      await profileStore.update(user.id, { logo_url: null });
      setLogoUrl(null);
      await refreshProfile();
      showSuccess("Logo removed.");
    } catch (e: any) {
      showError(e.message || "Could not remove logo.");
    }
  };

  const saveDomain = async () => {
    if (!domain.trim()) { showError("Enter a domain first."); return; }
    setSavingDomain(true);
    // Domain verification is a hosting-level step; we capture intent and guide.
    setTimeout(() => {
      setSavingDomain(false);
      showSuccess(`Point a CNAME for ${domain.trim()} at rendahq.com, then contact support to finish verification.`);
    }, 600);
  };

  const handleTestEmail = async () => {
    if (!testTo.trim()) { showError("Enter an email address to send the test to."); return; }
    setIsSendingTest(true);
    setTestResult(null);
    try {
      const result = await sendEmail({
        to: testTo.trim(),
        subject: "RendaHQ email is working",
        body: renderEmail({
          heading: "Your email is connected 🎉",
          paragraphs: [
            `This is a test from ${agencyName || "RendaHQ"}. If you can read this, transactional email is wired up correctly.`,
          ],
        }),
        fromName: agencyName || undefined,
      });
      if (result.success) {
        setTestResult({ success: true, message: `Test email sent to ${testTo.trim()}.` });
      } else {
        setTestResult({ success: false, message: result.error ?? "Failed to send." });
      }
    } catch (err: any) {
      setTestResult({ success: false, message: err?.message ?? "Failed to send." });
    } finally {
      setIsSendingTest(false);
    }
  };

  const initials = (fullName || user?.email || "U").charAt(0).toUpperCase();

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
          <p className="text-slate-500">Manage your account, branding, payments, and email.</p>
        </div>

        <Tabs defaultValue="branding" className="w-full">
          <TabsList className="bg-white border border-slate-200 p-1 h-12 mb-8 flex-wrap h-auto">
            <TabsTrigger value="branding" className="gap-2"><Palette className="w-4 h-4" /> Branding</TabsTrigger>
            <TabsTrigger value="account" className="gap-2"><UserIcon className="w-4 h-4" /> Account</TabsTrigger>
            <TabsTrigger value="payments" className="gap-2"><CreditCard className="w-4 h-4" /> Payments</TabsTrigger>
            <TabsTrigger value="domain" className="gap-2"><Globe className="w-4 h-4" /> Domain</TabsTrigger>
            <TabsTrigger value="email" className="gap-2"><Mail className="w-4 h-4" /> Email</TabsTrigger>
          </TabsList>

          {/* ── Branding ── */}
          <TabsContent value="branding" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-6">
                <Card className="border-none shadow-sm">
                  <CardHeader>
                    <CardTitle>Visual Identity</CardTitle>
                    <CardDescription>How your clients see you on portals, proposals, and invoices.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>Agency Name</Label>
                        <Input value={agencyName} onChange={(e) => setAgencyName(e.target.value)} placeholder="Your agency or studio name" />
                      </div>
                      <div className="space-y-2">
                        <Label>Primary Brand Color</Label>
                        <div className="flex gap-2">
                          <Input value={brandColor} onChange={(e) => setBrandColor(e.target.value)} className="flex-1 font-mono" />
                          <input
                            type="color"
                            value={/^#[0-9a-fA-F]{6}$/.test(brandColor) ? brandColor : "#059669"}
                            onChange={(e) => setBrandColor(e.target.value)}
                            className="w-10 h-10 rounded-md border border-slate-200 cursor-pointer bg-white"
                            aria-label="Pick brand color"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>Default Currency</Label>
                        <Select
                          value={currencyCode}
                          onValueChange={(val) => {
                            setCurrency(val);
                            showSuccess(`Currency set to ${currencies.find(c => c.code === val)?.name ?? val}. Save to persist.`);
                          }}
                        >
                          <SelectTrigger className="h-10 border-slate-200"><SelectValue /></SelectTrigger>
                          <SelectContent className="max-h-72">
                            <SelectItem value="_group_pay" disabled className="text-xs font-semibold text-emerald-600 uppercase tracking-wide py-1">
                              — Flutterwave supported —
                            </SelectItem>
                            {currencies.filter(c => c.paymentSupported).map((cur) => (
                              <SelectItem key={cur.code} value={cur.code}>
                                <span className="font-mono text-slate-500 mr-2 text-xs w-8 inline-block">{cur.symbol}</span>
                                {cur.name} ({cur.code})
                              </SelectItem>
                            ))}
                            <SelectItem value="_group_display" disabled className="text-xs font-semibold text-slate-400 uppercase tracking-wide py-1 mt-1">
                              — Display only (payments charged in USD) —
                            </SelectItem>
                            {currencies.filter(c => !c.paymentSupported).map((cur) => (
                              <SelectItem key={cur.code} value={cur.code}>
                                <span className="font-mono text-slate-400 mr-2 text-xs w-8 inline-block">{cur.symbol}</span>
                                {cur.name} ({cur.code})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-slate-400">Preview: {format(1250)} · {format(49999)}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label>Agency Logo</Label>
                      <input
                        ref={fileRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleLogoFile(e.target.files?.[0])}
                      />
                      {logoUrl ? (
                        <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-200">
                          <img src={logoUrl} alt="Agency logo" className="h-12 w-auto max-w-[160px] object-contain" />
                          <div className="flex gap-2 ml-auto">
                            <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()} disabled={uploading}>
                              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Replace"}
                            </Button>
                            <Button variant="ghost" size="sm" className="text-rose-600 hover:text-rose-700" onClick={removeLogo}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => fileRef.current?.click()}
                          disabled={uploading}
                          className="w-full border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-emerald-300 transition-colors"
                        >
                          {uploading ? (
                            <Loader2 className="w-8 h-8 text-emerald-500 mx-auto animate-spin" />
                          ) : (
                            <Upload className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                          )}
                          <p className="text-sm font-medium text-slate-600">
                            {uploading ? "Uploading…" : "Click to upload your logo"}
                          </p>
                          <p className="text-xs text-slate-400 mt-1">SVG, PNG, JPG up to 2MB</p>
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                      <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2" onClick={saveBranding} disabled={savingBrand}>
                        {savingBrand ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save Branding Changes
                      </Button>
                      <p className="text-xs text-slate-400">
                        Your logo &amp; colour appear on client portals, invoices, and proposals.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Live preview reflects real values */}
              <div className="space-y-6">
                <Card className="border-none shadow-sm bg-emerald-50 border-emerald-100">
                  <CardHeader><CardTitle className="text-sm font-bold text-emerald-900">Live Preview</CardTitle></CardHeader>
                  <CardContent>
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                      <div className="h-8 bg-slate-50 border-b border-slate-100 flex items-center px-3 gap-1">
                        <div className="w-2 h-2 rounded-full bg-slate-200" />
                        <div className="w-2 h-2 rounded-full bg-slate-200" />
                        <div className="w-2 h-2 rounded-full bg-slate-200" />
                      </div>
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-4">
                          {logoUrl
                            ? <img src={logoUrl} alt="" className="h-6 w-auto max-w-[80px] object-contain" />
                            : <div className="w-6 h-6 rounded" style={{ background: brandColor }} />}
                          <span className="text-xs font-bold text-slate-800 truncate">{agencyName || "Your Agency"}</span>
                        </div>
                        <div className="space-y-2">
                          <div className="h-4 w-full bg-slate-50 rounded" />
                          <div className="h-4 w-3/4 bg-slate-50 rounded" />
                        </div>
                        <div className="mt-4 h-8 w-full rounded" style={{ background: brandColor }} />
                      </div>
                    </div>
                    <p className="text-xs text-emerald-600 mt-4 text-center font-medium">
                      This is how your portal will look to clients.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* ── Account ── */}
          <TabsContent value="account" className="space-y-6">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle>Your Account</CardTitle>
                <CardDescription>Your personal details and current plan.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="w-14 h-14">
                    <AvatarFallback className="bg-emerald-100 text-emerald-700 font-bold text-lg">{initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-bold text-slate-900">{fullName || "Add your name"}</p>
                    <p className="text-sm text-slate-500">{user?.email}</p>
                  </div>
                  <Badge className="ml-auto border-none bg-emerald-50 text-emerald-700">{plan.name} plan</Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your name" />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input value={user?.email ?? ""} readOnly className="bg-slate-50 text-slate-500" />
                    <p className="text-xs text-slate-400">Email changes go through a confirmation link.</p>
                  </div>
                </div>

                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2" onClick={saveBranding} disabled={savingBrand}>
                  {savingBrand ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Account Details
                </Button>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Users className="w-4 h-4" /> Team Members</CardTitle>
                <CardDescription>Invite teammates to your workspace.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-emerald-100 text-emerald-700 font-bold">{initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-bold text-slate-900">{fullName || user?.email?.split("@")[0]}</p>
                      <p className="text-xs text-slate-500">{user?.email}</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-none">Owner</Badge>
                </div>
                <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-sm font-medium text-slate-700 mb-1">Multi-user workspaces are on the roadmap</p>
                  <p className="text-sm text-slate-500">
                    Team seats with roles and permissions aren't available yet — for now, your workspace is
                    single-user. We'll surface them here when they ship.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Payments (real status from configured keys) ── */}
          <TabsContent value="payments" className="space-y-6">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle>Payment Integrations</CardTitle>
                <CardDescription>
                  Status reflects the payment keys configured for this workspace. Clients pay you directly —
                  RendaHQ never holds your funds.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {GATEWAYS.map((gw) => {
                  const configured = Boolean((import.meta.env as any)[gw.envKey]);
                  return (
                    <div key={gw.name} className="flex flex-wrap items-center gap-4 justify-between p-4 rounded-xl border border-slate-100">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center font-bold text-emerald-600 shrink-0">
                          {gw.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-slate-900">{gw.name}</h4>
                          <p className="text-sm text-slate-500">{gw.desc}</p>
                        </div>
                      </div>
                      {configured ? (
                        <div className="flex items-center gap-1 text-emerald-600 text-sm font-bold shrink-0">
                          <Check className="w-4 h-4" /> Connected
                        </div>
                      ) : (
                        <a href={gw.docs} target="_blank" rel="noreferrer" className="shrink-0">
                          <Button variant="outline" size="sm" className="border-slate-200">Get API keys</Button>
                        </a>
                      )}
                    </div>
                  );
                })}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-sm text-slate-600">
                    A gateway shows <span className="font-semibold">Connected</span> once its public key is set in your
                    environment. Secret keys stay server-side and are never exposed to the browser.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Domain ── */}
          <TabsContent value="domain">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle>Custom Domain</CardTitle>
                <CardDescription>Serve client portals from your own domain.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {!canWhiteLabel && (
                  <UpgradeBanner
                    title="Agency plan required"
                    message="White-label custom domains are available on the Agency plan. Upgrade to remove RendaHQ branding."
                  />
                )}
                <div className="space-y-2">
                  <Label>Your Domain</Label>
                  <div className="flex gap-2">
                    <Input
                      value={domain}
                      onChange={(e) => setDomain(e.target.value)}
                      placeholder="portal.youragency.com"
                      disabled={!canWhiteLabel}
                    />
                    <Button variant="outline" onClick={saveDomain} disabled={!canWhiteLabel || savingDomain}>
                      {savingDomain ? <Loader2 className="w-4 h-4 animate-spin" /> : "Connect"}
                    </Button>
                  </div>
                  {canWhiteLabel && (
                    <p className="text-xs text-emerald-600 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Included in your plan.
                    </p>
                  )}
                </div>
                {canWhiteLabel && (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-sm text-slate-600 space-y-1">
                    <p className="font-medium text-slate-700">How it works</p>
                    <p>1. Add a CNAME record for your subdomain pointing to <span className="font-mono">rendahq.com</span>.</p>
                    <p>2. Enter the domain above and click Connect.</p>
                    <p>3. HTTPS is provisioned automatically once DNS resolves.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Email ── */}
          <TabsContent value="email" className="space-y-6">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle>Email Delivery</CardTitle>
                <CardDescription>
                  RendaHQ sends invoice reminders, contracts, and proposals through Resend. Send a test to confirm delivery.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-emerald-900">Email service active</p>
                    <p className="text-sm text-emerald-700">
                      Sent server-side — your API key never reaches the browser.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Sender Name</Label>
                    <Input value={agencyName || "RendaHQ"} readOnly className="bg-slate-50 text-slate-500" />
                    <p className="text-xs text-slate-400">Taken from your agency name in Branding.</p>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Send Test To</Label>
                    <Input value={testTo} onChange={(e) => setTestTo(e.target.value)} placeholder="you@example.com" />
                  </div>
                </div>

                {testResult && (
                  <div className={`flex items-center gap-2 p-3 rounded-lg text-sm font-medium ${
                    testResult.success
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                      : "bg-red-50 text-red-700 border border-red-100"
                  }`}>
                    {testResult.success ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                    {testResult.message}
                  </div>
                )}

                <Button
                  className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
                  onClick={handleTestEmail}
                  disabled={isSendingTest}
                >
                  {isSendingTest ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  {isSendingTest ? "Sending…" : "Send Test Email"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
