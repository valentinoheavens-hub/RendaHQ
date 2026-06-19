import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Globe,
  Palette,
  Shield,
  CreditCard,
  Upload,
  Check,
  Users,
  UserPlus,
  Mail,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { sendTestEmail } from "@/lib/email";
import { useCurrency } from "@/hooks/useCurrency";
import { showSuccess } from "@/utils/toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Settings = () => {
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const { code: currencyCode, currencies, setCurrency, format } = useCurrency();

  const handleTestEmail = async () => {
    setIsSendingTest(true);
    setTestResult(null);
    try {
      const result = await sendTestEmail();
      if ((result as any)?.error) {
        setTestResult({ success: false, message: (result as any).error.message ?? "Failed to send." });
      } else {
        setTestResult({ success: true, message: "Test email sent to valentinoheavens@gmail.com!" });
      }
    } catch (err: any) {
      setTestResult({ success: false, message: err?.message ?? "Failed to send." });
    } finally {
      setIsSendingTest(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
          <p className="text-slate-500">Manage your account, branding, and team collaboration.</p>
        </div>

        <Tabs defaultValue="branding" className="w-full">
          <TabsList className="bg-white border border-slate-200 p-1 h-12 mb-8">
            <TabsTrigger value="branding" className="gap-2"><Palette className="w-4 h-4" /> Branding</TabsTrigger>
            <TabsTrigger value="team" className="gap-2"><Users className="w-4 h-4" /> Team</TabsTrigger>
            <TabsTrigger value="payments" className="gap-2"><CreditCard className="w-4 h-4" /> Payments</TabsTrigger>
            <TabsTrigger value="domain" className="gap-2"><Globe className="w-4 h-4" /> Domain</TabsTrigger>
            <TabsTrigger value="email" className="gap-2"><Mail className="w-4 h-4" /> Email</TabsTrigger>
          </TabsList>

          <TabsContent value="branding" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-6">
                <Card className="border-none shadow-sm">
                  <CardHeader>
                    <CardTitle>Visual Identity</CardTitle>
                    <CardDescription>Customize how your clients see your portal.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>Agency Name</Label>
                        <Input defaultValue="RendaHQ Design Studio" />
                      </div>
                      <div className="space-y-2">
                        <Label>Primary Brand Color</Label>
                        <div className="flex gap-2">
                          <Input defaultValue="#4F46E5" className="flex-1" />
                          <div className="w-10 h-10 rounded-md bg-emerald-600 border border-slate-200" />
                        </div>
                      </div>
                    </div>

                    {/* Currency preference */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>Default Currency</Label>
                        <Select
                          value={currencyCode}
                          onValueChange={(val) => {
                            setCurrency(val);
                            showSuccess(`Currency changed to ${currencies.find(c => c.code === val)?.name ?? val}`);
                          }}
                        >
                          <SelectTrigger className="h-10 border-slate-200">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="max-h-72">
                            <SelectItem value="_group_pay" disabled className="text-xs font-semibold text-emerald-600 uppercase tracking-wide py-1">
                              — Paystack &amp; Flutterwave supported —
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
                        <p className="text-xs text-slate-400">
                          Preview: {format(1250)} · {format(49999)}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label>Agency Logo</Label>
                      <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-emerald-300 transition-colors cursor-pointer">
                        <Upload className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <p className="text-sm font-medium text-slate-600">Click to upload or drag and drop</p>
                        <p className="text-xs text-slate-400 mt-1">SVG, PNG, JPG up to 2MB</p>
                      </div>
                    </div>

                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">Save Branding Changes</Button>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="border-none shadow-sm bg-emerald-50 border-emerald-100">
                  <CardHeader>
                    <CardTitle className="text-sm font-bold text-emerald-900">Live Preview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                      <div className="h-8 bg-slate-50 border-b border-slate-100 flex items-center px-3 gap-1">
                        <div className="w-2 h-2 rounded-full bg-slate-200" />
                        <div className="w-2 h-2 rounded-full bg-slate-200" />
                        <div className="w-2 h-2 rounded-full bg-slate-200" />
                      </div>
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-6 h-6 bg-emerald-600 rounded" />
                          <div className="h-3 w-20 bg-slate-100 rounded" />
                        </div>
                        <div className="space-y-2">
                          <div className="h-4 w-full bg-slate-50 rounded" />
                          <div className="h-4 w-3/4 bg-slate-50 rounded" />
                        </div>
                        <div className="mt-4 h-8 w-full bg-emerald-600 rounded" />
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

          <TabsContent value="team" className="space-y-6">
            <Card className="border-none shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Team Members</CardTitle>
                  <CardDescription>Manage who has access to your agency dashboard.</CardDescription>
                </div>
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
                  <UserPlus className="w-4 h-4" /> Invite Member
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: "Felix K.", email: "felix@rendahq.com", role: "Owner", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" },
                  { name: "Sarah Chen", email: "sarah@rendahq.com", role: "Senior UI/UX Designer", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200" },
                  { name: "Marcus T.", email: "marcus@rendahq.com", role: "Full-stack Developer", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200" },
                  { name: "Elena Moss", email: "elena@rendahq.com", role: "Project Manager", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200" },
                ].map((member) => (
                  <div key={member.email} className="flex items-center justify-between p-4 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-bold text-slate-900">{member.name}</p>
                        <p className="text-xs text-slate-500">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-none">
                        {member.role}
                      </Badge>
                      <Button variant="ghost" size="sm" className="text-slate-400">Edit</Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="space-y-6">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle>Payment Integrations</CardTitle>
                <CardDescription>Connect your preferred payment gateways to receive funds globally.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {[
                    { name: "Stripe", desc: "Global credit card payments and bank transfers.", status: "Connected" },
                    { name: "Paystack", desc: "Optimized for Nigeria, Ghana, and South Africa.", status: "Connected" },
                    { name: "Flutterwave", desc: "Accept payments across 30+ African countries.", status: "Not Connected" },
                    { name: "M-Pesa", desc: "Direct mobile money payments for East Africa.", status: "Not Connected" },
                  ].map((gateway) => (
                    <div key={gateway.name} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-emerald-100 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center font-bold text-emerald-600">
                          {gateway.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900">{gateway.name}</h4>
                          <p className="text-sm text-slate-500">{gateway.desc}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {gateway.status === "Connected" ? (
                          <div className="flex items-center gap-1 text-emerald-600 text-sm font-bold">
                            <Check className="w-4 h-4" /> Connected
                          </div>
                        ) : (
                          <Button variant="outline" size="sm" className="border-slate-200">Connect</Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="domain">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle>Custom Domain</CardTitle>
                <CardDescription>Connect your own domain to remove RendaHQ branding.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex gap-3">
                  <Shield className="w-5 h-5 text-amber-600 shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-amber-900">Agency Plan Required</p>
                    <p className="text-sm text-amber-700">Custom domains are only available on the Agency and Scale plans.</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Your Domain</Label>
                  <div className="flex gap-2">
                    <Input placeholder="portal.youragency.com" disabled />
                    <Button variant="outline" disabled>Connect</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="email" className="space-y-6">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle>Email Delivery</CardTitle>
                <CardDescription>
                  RendaHQ uses Resend to send invoice reminders, contract notifications, and proposals. Use the button below to verify your connection.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Status */}
                <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-emerald-900">Resend Connected</p>
                    <p className="text-sm text-emerald-700">
                      Sending via <span className="font-mono">onboarding@resend.dev</span> — verified Resend sender.
                    </p>
                  </div>
                </div>

                {/* Config details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>From Address</Label>
                    <Input value="onboarding@resend.dev" readOnly className="bg-slate-50 text-slate-500" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Default Reply-To</Label>
                    <Input placeholder="Not set — replies go to sender" readOnly className="bg-slate-50 text-slate-500" />
                  </div>
                </div>

                {/* Test email */}
                <div className="border-t border-slate-100 pt-6 space-y-4">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm mb-1">Send a Test Email</h4>
                    <p className="text-sm text-slate-500">
                      Sends a quick "Hello World" email to <span className="font-semibold text-slate-700">valentinoheavens@gmail.com</span> to confirm delivery is working.
                    </p>
                  </div>

                  {testResult && (
                    <div className={`flex items-center gap-2 p-3 rounded-lg text-sm font-medium ${
                      testResult.success
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                        : "bg-red-50 text-red-700 border border-red-100"
                    }`}>
                      {testResult.success
                        ? <CheckCircle2 className="w-4 h-4 shrink-0" />
                        : <AlertCircle className="w-4 h-4 shrink-0" />}
                      {testResult.message}
                    </div>
                  )}

                  <Button
                    className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
                    onClick={handleTestEmail}
                    disabled={isSendingTest}
                  >
                    {isSendingTest
                      ? <Loader2 className="w-4 h-4 animate-spin" />
                      : <Send className="w-4 h-4" />}
                    {isSendingTest ? "Sending…" : "Send Test Email"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;