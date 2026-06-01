"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Beaker, 
  TrendingUp, 
  Target, 
  Zap, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Lightbulb,
  BarChart3,
  Rocket,
  Plus,
  MoreVertical,
  Filter,
  Users,
  Sparkles,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { generateGrowthIdeas } from "@/lib/ai";
import { showError } from "@/utils/toast";

const GrowthLab = () => {
  const [growthInsight, setGrowthInsight] = useState("");
  const [isLoadingGrowth, setIsLoadingGrowth] = useState(false);

  const handleGrowthIdeas = async () => {
    setIsLoadingGrowth(true);
    try {
      const funnelSummary = funnelData.map(f => `${f.stage}: ${f.count} (${f.conversion})`).join(', ');
      const expSummary = experiments.map(e =>
        `"${e.title || e.name}" — Status: ${e.status}, Impact: ${e.impact}, Confidence: ${e.confidence}%, Results: ${e.results}`
      ).join('\n');
      const context = `Funnel:\n${funnelSummary}\n\nExperiments:\n${expSummary}`;
      const result = await generateGrowthIdeas(context);
      setGrowthInsight(result);
    } catch (err: any) {
      showError(err.message || "Failed to generate growth ideas.");
    } finally {
      setIsLoadingGrowth(false);
    }
  };

  const experiments = [
    { 
      id: 1, 
      title: "Value-Based Pricing Test", 
      hypothesis: "Switching from hourly to value-based pricing for Brand Identity will increase project margin by 25%.",
      status: "Active",
      impact: "High",
      confidence: 80,
      ease: 60,
      startDate: "Oct 15",
      results: "Pending"
    },
    { 
      id: 2, 
      name: "Fintech Outreach Campaign", 
      hypothesis: "Targeted LinkedIn outreach to Series A Fintech founders will yield a 15% lead conversion rate.",
      status: "Completed",
      impact: "Medium",
      confidence: 70,
      ease: 40,
      startDate: "Sep 01",
      results: "18% Conversion (Success)"
    },
    { 
      id: 3, 
      name: "Automated Onboarding Flow", 
      hypothesis: "Using the new Questionnaire Builder will reduce client onboarding time by 60%.",
      status: "Active",
      impact: "High",
      confidence: 90,
      ease: 80,
      startDate: "Oct 28",
      results: "Tracking"
    }
  ];

  const funnelData = [
    { stage: "Leads", count: 124, conversion: "100%" },
    { stage: "Qualified", count: 42, conversion: "34%" },
    { stage: "Proposals", count: 18, conversion: "43%" },
    { stage: "Contracts", count: 8, conversion: "44%" },
    { stage: "Loyal Clients", count: 3, conversion: "37%" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Growth Lab</h1>
            <p className="text-slate-500">Design, execute, and measure strategic business experiments.</p>
          </div>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 shadow-lg shadow-indigo-100">
            <Plus className="w-4 h-4" />
            New Experiment
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Conversion Funnel */}
          <Card className="lg:col-span-1 border-none shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-indigo-600" />
                <CardTitle className="text-lg font-bold">Conversion Funnel</CardTitle>
              </div>
              <CardDescription>Lead-to-Client lifecycle performance.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {funnelData.map((item, i) => (
                <div key={item.stage} className="relative">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-slate-700">{item.stage}</span>
                    <span className="text-xs font-bold text-slate-400">{item.count}</span>
                  </div>
                  <div className="h-8 bg-slate-50 rounded-lg overflow-hidden flex items-center px-3 relative">
                    <div 
                      className="absolute inset-0 bg-indigo-600/10" 
                      style={{ width: `${(item.count / funnelData[0].count) * 100}%` }}
                    />
                    <span className="relative z-10 text-[10px] font-black text-indigo-600">
                      {i > 0 ? `↓ ${item.conversion} conversion` : "Baseline"}
                    </span>
                  </div>
                </div>
              ))}
              <div className="mt-6 p-4 bg-indigo-50 rounded-xl border border-indigo-100 space-y-3">
                <div className="flex gap-3">
                  <Zap className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-indigo-900 leading-relaxed">
                    {growthInsight
                      ? <span>{growthInsight}</span>
                      : <><span className="font-bold">Funnel Insight:</span> Click below to get an AI-powered analysis of your biggest growth lever.</>
                    }
                  </p>
                </div>
                <Button
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs gap-2 h-8 rounded-lg"
                  onClick={handleGrowthIdeas}
                  disabled={isLoadingGrowth}
                >
                  {isLoadingGrowth ? (
                    <><Loader2 className="w-3 h-3 animate-spin" /> Analyzing...</>
                  ) : (
                    <><Sparkles className="w-3 h-3" /> {growthInsight ? "Refresh" : "Analyze Growth"}</>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Active Experiments */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900">Strategic Experiments</h3>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="text-slate-500">Active</Button>
                <Button variant="ghost" size="sm" className="text-slate-500">Completed</Button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {experiments.map((exp) => (
                <Card key={exp.id} className="border-none shadow-sm hover:shadow-md transition-all group">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center",
                          exp.status === "Active" ? "bg-indigo-50 text-indigo-600" : "bg-emerald-50 text-emerald-600"
                        )}>
                          <Beaker className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{exp.title || exp.name}</h4>
                          <p className="text-xs text-slate-500">Started {exp.startDate} • Impact: <span className="font-bold text-slate-700">{exp.impact}</span></p>
                        </div>
                      </div>
                      <Badge className={cn(
                        "border-none",
                        exp.status === "Active" ? "bg-blue-50 text-blue-700" : "bg-emerald-50 text-emerald-700"
                      )}>
                        {exp.status}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-slate-600 mb-6 leading-relaxed italic">
                      "{exp.hypothesis}"
                    </p>

                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-50">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Confidence</p>
                        <div className="flex items-center gap-2">
                          <Progress value={exp.confidence} className="h-1.5 flex-1 bg-slate-100" />
                          <span className="text-[10px] font-bold text-slate-700">{exp.confidence}%</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Ease of Setup</p>
                        <div className="flex items-center gap-2">
                          <Progress value={exp.ease} className="h-1.5 flex-1 bg-slate-100" />
                          <span className="text-[10px] font-bold text-slate-700">{exp.ease}%</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Results</p>
                        <p className={cn(
                          "text-xs font-bold",
                          exp.results.includes("Success") ? "text-emerald-600" : "text-slate-500"
                        )}>{exp.results}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Growth Playbooks */}
        <div className="space-y-4">
          <h3 className="font-bold text-slate-900">Growth Playbooks</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { 
                title: "The Retainer Switch", 
                desc: "Convert one-off project clients into recurring monthly revenue.",
                icon: Rocket,
                color: "bg-violet-500"
              },
              { 
                title: "Referral Engine", 
                desc: "Automate the process of asking for referrals after successful project delivery.",
                icon: Users,
                color: "bg-blue-500"
              },
              { 
                title: "Niche Authority", 
                desc: "Reposition your agency as the go-to expert for a specific vertical.",
                icon: Target,
                color: "bg-rose-500"
              }
            ].map((playbook) => (
              <Card key={playbook.title} className="border-none shadow-sm hover:shadow-md transition-all cursor-pointer group">
                <CardContent className="p-6">
                  <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center text-white mb-4 shadow-lg", playbook.color)}>
                    <playbook.icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">{playbook.title}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed mb-4">{playbook.desc}</p>
                  <Button variant="ghost" size="sm" className="p-0 text-indigo-600 hover:bg-transparent font-bold gap-1">
                    Launch Playbook <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default GrowthLab;