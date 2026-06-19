import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  BookOpen, 
  Video, 
  MessageCircle, 
  FileText, 
  Zap,
  ChevronRight,
  ExternalLink
} from "lucide-react";

const HelpCenter = () => {
  const categories = [
    { title: "Getting Started", desc: "Learn the basics of setting up your agency.", icon: Zap, color: "text-amber-600", bg: "bg-amber-50" },
    { title: "Client Portals", desc: "How to white-label and manage client access.", icon: BookOpen, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Payments & Invoicing", desc: "Setting up Stripe, Paystack, Flutterwave, and M-Pesa.", icon: FileText, color: "text-emerald-600", bg: "bg-emerald-50" },
    { title: "Video Tutorials", desc: "Watch step-by-step guides for every feature.", icon: Video, color: "text-rose-600", bg: "bg-rose-50" },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">How can we help you today?</h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Search our knowledge base or browse categories below to find answers to your questions.
          </p>
          <div className="relative max-w-xl mx-auto mt-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input 
              placeholder="Search for articles, guides, and more..." 
              className="pl-12 h-14 text-lg rounded-2xl border-slate-200 shadow-sm focus-visible:ring-emerald-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((cat) => (
            <Card key={cat.title} className="border-none shadow-sm hover:shadow-md transition-all group cursor-pointer">
              <CardContent className="p-8 flex items-start gap-6">
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shrink-0", cat.bg, cat.color)}>
                  <cat.icon className="w-7 h-7" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">{cat.title}</h3>
                  <p className="text-slate-500 leading-relaxed mb-4">{cat.desc}</p>
                  <div className="flex items-center text-emerald-600 font-bold text-sm gap-1">
                    Browse Articles <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Popular Articles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                "How to connect your custom domain",
                "Setting up automated payment reminders",
                "Using the AI Contract Builder effectively",
                "Managing scope changes with Change Orders",
                "Inviting clients to their white-labeled portal",
              ].map((article, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group">
                  <span className="text-slate-700 font-medium group-hover:text-emerald-600">{article}</span>
                  <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-emerald-400" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-slate-900 text-white">
            <CardContent className="p-8 text-center space-y-6">
              <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20">
                <MessageCircle className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Still need help?</h3>
                <p className="text-slate-400 text-sm">
                  Our support team is available 24/7 to help you with any technical issues.
                </p>
              </div>
              <Button className="w-full bg-white text-slate-900 hover:bg-slate-100 font-bold py-6 rounded-xl">
                Chat with Support
              </Button>
              <p className="text-xs text-slate-500">Average response time: 5 minutes</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

import { cn } from "@/lib/utils";
export default HelpCenter;