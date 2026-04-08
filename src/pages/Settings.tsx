import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Globe, 
  Palette, 
  Shield, 
  Bell, 
  CreditCard,
  Upload,
  Check
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Settings = () => {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
          <p className="text-slate-500">Manage your agency profile and portal customization.</p>
        </div>

        <Tabs defaultValue="branding" className="w-full">
          <TabsList className="bg-white border border-slate-200 p-1 h-12 mb-8">
            <TabsTrigger value="branding" className="gap-2 data-[state=active]:bg-slate-100">
              <Palette className="w-4 h-4" /> Branding
            </TabsTrigger>
            <TabsTrigger value="domain" className="gap-2 data-[state=active]:bg-slate-100">
              <Globe className="w-4 h-4" /> Domain
            </TabsTrigger>
            <TabsTrigger value="billing" className="gap-2 data-[state=active]:bg-slate-100">
              <CreditCard className="w-4 h-4" /> Billing
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2 data-[state=active]:bg-slate-100">
              <Shield className="w-4 h-4" /> Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="branding" className="space-y-6">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle>Portal Customization</CardTitle>
                <CardDescription>Customize how your clients see their portal.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <Label>Agency Logo</Label>
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 rounded-xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400">
                        <Upload className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <Button variant="outline" size="sm">Upload New</Button>
                        <p className="text-xs text-slate-400">PNG, JPG up to 2MB</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <Label>Primary Brand Color</Label>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-indigo-600 border border-slate-200" />
                      <Input defaultValue="#4F46E5" className="max-w-[120px]" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Agency Name</Label>
                  <Input defaultValue="NexWork Agency" />
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">Save Changes</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-slate-900 text-white">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">Preview Portal</h3>
                    <p className="text-slate-400">See how your branding looks to your clients.</p>
                  </div>
                  <Button className="bg-white text-slate-900 hover:bg-slate-100 border-none">
                    Open Live Preview
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="domain">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle>Custom Domain</CardTitle>
                <CardDescription>Connect your own domain to the client portal.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100 flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-white text-indigo-600">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-indigo-900">Upgrade to Agency Plan</h4>
                    <p className="text-sm text-indigo-700 mt-1">
                      Custom domains are available on the Agency and Scale plans. 
                      Professionalize your business with a domain like portal.youragency.com
                    </p>
                    <Button className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white border-none">
                      Upgrade Now
                    </Button>
                  </div>
                </div>

                <div className="space-y-4 opacity-50 pointer-events-none">
                  <Label>Domain Name</Label>
                  <div className="flex gap-2">
                    <Input placeholder="portal.youragency.com" />
                    <Button variant="outline">Connect</Button>
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