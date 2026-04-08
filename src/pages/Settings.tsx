import React from "react";
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
  Bell, 
  CreditCard,
  Upload,
  Check,
  ExternalLink,
  Users,
  UserPlus,
  Mail
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Settings = () => {
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
                        <Input defaultValue="NexWork Design Studio" />
                      </div>
                      <div className="space-y-2">
                        <Label>Primary Brand Color</Label>
                        <div className="flex gap-2">
                          <Input defaultValue="#4F46E5" className="flex-1" />
                          <div className="w-10 h-10 rounded-md bg-indigo-600 border border-slate-200" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label>Agency Logo</Label>
                      <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-indigo-300 transition-colors cursor-pointer">
                        <Upload className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <p className="text-sm font-medium text-slate-600">Click to upload or drag and drop</p>
                        <p className="text-xs text-slate-400 mt-1">SVG, PNG, JPG up to 2MB</p>
                      </div>
                    </div>

                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">Save Branding Changes</Button>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="border-none shadow-sm bg-indigo-50 border-indigo-100">
                  <CardHeader>
                    <CardTitle className="text-sm font-bold text-indigo-900">Live Preview</CardTitle>
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
                          <div className="w-6 h-6 bg-indigo-600 rounded" />
                          <div className="h-3 w-20 bg-slate-100 rounded" />
                        </div>
                        <div className="space-y-2">
                          <div className="h-4 w-full bg-slate-50 rounded" />
                          <div className="h-4 w-3/4 bg-slate-50 rounded" />
                        </div>
                        <div className="mt-4 h-8 w-full bg-indigo-600 rounded" />
                      </div>
                    </div>
                    <p className="text-xs text-indigo-600 mt-4 text-center font-medium">
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
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
                  <UserPlus className="w-4 h-4" /> Invite Member
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: "Felix K.", email: "felix@nexwork.io", role: "Owner", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" },
                  { name: "Sarah Chen", email: "sarah@nexwork.io", role: "Project Manager", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" },
                  { name: "Marcus T.", email: "marcus@nexwork.io", role: "Designer", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus" },
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
                    <div key={gateway.name} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-indigo-100 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center font-bold text-indigo-600">
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
                <CardDescription>Connect your own domain to remove NexWork branding.</CardDescription>
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
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;