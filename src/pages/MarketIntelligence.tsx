"use client";

import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Plus, 
  TrendingUp, 
  ShieldAlert, 
  Target, 
  Globe, 
  BarChart3, 
  MoreVertical,
  ArrowUpRight,
  Zap,
  Eye,
  Layers,
  ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";

const MarketIntelligence = () => {
  const competitors = [
    { 
      name: "Pixel Perfect Agency", 
      focus: "High-end UI/UX", 
      pricing: "$150 - $200/hr", 
      strength: "Visual Design", 
      weakness: "Development Speed",
      status: "Direct"
    },
    { 
      name: "CodeCraft Studio", 
      focus: "Full-stack Dev", 
      pricing: "$100 - $150/hr", 
      strength: "Technical Execution", 
      weakness: "Brand Strategy",
      status: "Indirect"
    },
    { 
      name: "GrowthHackers Inc", 
      focus: "Marketing & SEO", 
      pricing: "Retainer based", 
      strength: "Lead Gen", 
      weakness: "Design Quality",
      status: "Partner Potential"
    }
  ];

  const trends = [
    { title: "AI-Driven Design Workflows", impact: "High", sentiment: "Positive", date: "Oct 2023" },
    { title: "Shift to Value-Based Pricing", impact: "Medium", sentiment: "Neutral", date: "Sep 2023" },
    { title: "Remote-First Agency Models", impact: "High", sentiment: "Positive", date: "Aug 2023" }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Market Intelligence</h1>
            <p className="text-slate-500">Monitor competitors, industry shifts, and strategic positioning.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-slate-200">Market Report</Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 shadow-lg shadow-indigo-100">
              <Plus className="w-4 h-4" />
              Add Competitor
            </Button>
          </div>
        </div>

        {/* SWOT Analysis Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: "Strengths", items: ["Niche Fintech Expertise", "Fast Turnaround"], color: "bg-emerald-50 text-emerald-700 border-emerald-100" },
            { title: "Weaknesses", items: ["Small Team Capacity", "Limited SEO Services"], color: "bg-rose-50 text-rose-700 border-rose-100" },
            { title: "Opportunities", items: ["AI Integration", "African Market Growth"], color: "bg-blue-50 text-blue-700 border-blue-100" },
            { title: "Threats", items: ["Low-cost Outsourcing", "Economic Downturn"], color: "bg-amber-50 text-amber-700 border-amber-100" },
          ].map((swot) => (
            <Card key={swot.title} className={cn("border-none shadow-sm", swot.color)}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-black uppercase tracking-widest">{swot.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1">
                  {swot.items.map((item, i) => (
                    <li key={i} className="text-xs font-medium flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-current opacity-40" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Competitor Tracking */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">Competitor Landscape</h3>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input placeholder="Search competitors..." className="pl-10 bg-white border-slate-200 h-9 text-sm" />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {competitors.map((comp) => (
                <Card key={comp.name} className="border-none shadow-sm hover:shadow-md transition-all group">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex items-center gap-4 min-w-[200px]">
                        <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                          <Globe className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{comp.name}</h4>
                          <p className="text-xs text-slate-500">{comp.focus}</p>
                        </div>
                      </div>

                      <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-8">
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Pricing</p>
                          <p className="text-sm font-bold text-slate-700">{comp.pricing}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Core Strength</p>
                          <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 border-none text-[10px]">
                            {comp.strength}
                          </Badge>
                        </div>
                        <div className="hidden md:block">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
                          <Badge className={cn(
                            "border-none text-[10px]",
                            comp.status === "Direct" ? "bg-rose-50 text-rose-700" : "bg-slate-100 text-slate-600"
                          )}>
                            {comp.status}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="text-slate-400">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-slate-400">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Market Trends Sidebar */}
          <div className="space-y-6">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-indigo-600" />
                  <CardTitle className="text-lg font-bold">Industry Trends</CardTitle>
                </div>
                <CardDescription>Key shifts affecting your market.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {trends.map((trend, i) => (
                  <div key={i} className="flex gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                      trend.sentiment === "Positive" ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-400"
                    )}>
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{trend.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className="bg-slate-100 text-slate-500 border-none text-[10px] px-1.5 py-0">
                          {trend.impact} Impact
                        </Badge>
                        <span className="text-[10px] text-slate-400">{trend.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full border-slate-200 text-slate-600">View Trend Analysis</Button>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-slate-900 text-white">
              <CardContent className="p-8 text-center space-y-6">
                <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl shadow-indigo-500/20">
                  <Target className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Positioning Gap</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    We've identified a gap in the market for "AI-Assisted Fintech Compliance Design". None of your direct competitors offer this yet.
                  </p>
                </div>
                <Button className="w-full bg-white text-slate-900 hover:bg-slate-100 font-bold py-6 rounded-xl">
                  Explore Opportunity
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MarketIntelligence;