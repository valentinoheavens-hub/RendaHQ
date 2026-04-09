"use client";

import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Target, 
  TrendingUp, 
  Flag, 
  CheckCircle2, 
  Clock, 
  Plus, 
  MoreVertical,
  ArrowUpRight,
  Layers,
  Zap,
  BarChart3,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const StrategicPlanning = () => {
  const objectives = [
    {
      id: 1,
      title: "Dominate the Fintech Design Market",
      period: "Q4 2023",
      progress: 65,
      status: "On Track",
      keyResults: [
        { title: "Acquire 3 new Fintech clients with >$10k budget", current: 2, target: 3, unit: "clients" },
        { title: "Publish 2 case studies on Fintech UX improvements", current: 1, target: 2, unit: "studies" },
        { title: "Achieve a 90% satisfaction rate from Fintech clients", current: 85, target: 90, unit: "%" }
      ]
    },
    {
      id: 2,
      title: "Optimize Operational Efficiency",
      period: "Q4 2023",
      progress: 40,
      status: "At Risk",
      keyResults: [
        { title: "Reduce client onboarding time by 50%", current: 20, target: 50, unit: "%" },
        { title: "Automate 80% of invoicing and payment reminders", current: 30, target: 80, unit: "%" },
        { title: "Decrease unbilled revision hours by 15%", current: 5, target: 15, unit: "%" }
      ]
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Strategic Planning</h1>
            <p className="text-slate-500">Align your daily actions with high-level business objectives.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-slate-200">Quarterly Review</Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 shadow-lg shadow-indigo-100">
              <Plus className="w-4 h-4" />
              New Objective
            </Button>
          </div>
        </div>

        {/* Strategy Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                  <Target className="w-5 h-5" />
                </div>
                <Badge className="bg-indigo-50 text-indigo-700 border-none">Q4 2023</Badge>
              </div>
              <p className="text-sm font-medium text-slate-500">Active Objectives</p>
              <h3 className="text-2xl font-bold text-slate-900">4 Strategic Goals</h3>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>
              <p className="text-sm font-medium text-slate-500">Overall Progress</p>
              <div className="flex items-center gap-3 mt-1">
                <h3 className="text-2xl font-bold text-slate-900">52%</h3>
                <Progress value={52} className="h-2 flex-1 bg-slate-100" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
                  <Zap className="w-5 h-5" />
                </div>
              </div>
              <p className="text-sm font-medium text-slate-500">Strategic Initiatives</p>
              <h3 className="text-2xl font-bold text-slate-900">12 Active Tasks</h3>
            </CardContent>
          </Card>
        </div>

        {/* OKRs Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900">Objectives & Key Results</h3>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="text-slate-500">All</Button>
              <Button variant="ghost" size="sm" className="text-slate-500">On Track</Button>
              <Button variant="ghost" size="sm" className="text-slate-500">At Risk</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {objectives.map((obj) => (
              <Card key={obj.id} className="border-none shadow-sm overflow-hidden group">
                <div className="bg-white p-6 border-b border-slate-50">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center",
                        obj.status === "On Track" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                      )}>
                        <Flag className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{obj.title}</h4>
                        <p className="text-xs text-slate-500">{obj.period} • {obj.keyResults.length} Key Results</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right min-w-[120px]">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Progress</p>
                        <div className="flex items-center gap-2">
                          <Progress value={obj.progress} className="h-1.5 w-24 bg-slate-100" />
                          <span className="text-sm font-bold text-slate-900">{obj.progress}%</span>
                        </div>
                      </div>
                      <Badge className={cn(
                        "border-none",
                        obj.status === "On Track" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                      )}>
                        {obj.status}
                      </Badge>
                      <Button variant="ghost" size="icon" className="text-slate-400">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                <CardContent className="p-0 bg-slate-50/30">
                  <div className="divide-y divide-slate-50">
                    {obj.keyResults.map((kr, i) => (
                      <div key={i} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white transition-colors">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-700">{kr.title}</p>
                        </div>
                        <div className="flex items-center gap-8">
                          <div className="w-48">
                            <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                              <span>Current: {kr.current}{kr.unit === "%" ? "%" : ""}</span>
                              <span>Target: {kr.target}{kr.unit === "%" ? "%" : ""}</span>
                            </div>
                            <Progress 
                              value={(kr.current / kr.target) * 100} 
                              className="h-1 bg-slate-100 [&>div]:bg-indigo-500" 
                            />
                          </div>
                          <div className="w-12 text-right">
                            <span className="text-xs font-bold text-slate-900">
                              {Math.round((kr.current / kr.target) * 100)}%
                            </span>
                          </div>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300">
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Strategic Initiatives */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Strategic Initiatives</CardTitle>
              <CardDescription>Projects directly linked to your Q4 objectives.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { title: "Fintech Outreach Campaign", objective: "Dominate Fintech Market", status: "Active", impact: "High" },
                { title: "Onboarding Automation v2", objective: "Operational Efficiency", status: "Planning", impact: "Medium" },
                { title: "Case Study: Global Tech UX", objective: "Dominate Fintech Market", status: "Review", impact: "High" }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-indigo-100 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                      <Layers className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                      <p className="text-[10px] text-slate-500">Linked to: {item.objective}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-none text-[10px]">
                      {item.status}
                    </Badge>
                    <Badge className="bg-indigo-50 text-indigo-700 border-none text-[10px]">
                      {item.impact} Impact
                    </Badge>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300">
                      <ArrowUpRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-slate-900 text-white">
            <CardContent className="p-8 text-center space-y-6">
              <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl shadow-indigo-500/20">
                <BarChart3 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Strategy Insights</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Your "Operational Efficiency" objective is at risk. We recommend prioritizing the "Onboarding Automation" initiative to recover progress.
                </p>
              </div>
              <Button className="w-full bg-white text-slate-900 hover:bg-slate-100 font-bold py-6 rounded-xl">
                View Strategy Report
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StrategicPlanning;