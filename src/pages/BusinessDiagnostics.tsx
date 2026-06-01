"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Activity, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Target, 
  Users, 
  DollarSign, 
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  ShieldAlert,
  Lightbulb,
  BarChart3,
  PieChart as PieChartIcon,
  Sparkles,
  Loader2
} from "lucide-react";
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  Legend
} from "recharts";
import { cn } from "@/lib/utils";
import { generateDiagnosticReco } from "@/lib/ai";
import { showError, showSuccess } from "@/utils/toast";

const BusinessDiagnostics = () => {
  const [aiReco, setAiReco] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const handleRunDiagnostic = async () => {
    setIsRunning(true);
    try {
      const context = diagnostics.map(d =>
        `${d.title}: Score ${d.score}/100 (${d.status}) — ${d.metric}. ${d.description}`
      ).join('\n');
      const result = await generateDiagnosticReco(context);
      setAiReco(result);
      showSuccess("Diagnostic complete!");
    } catch (err: any) {
      showError(err.message || "Diagnostic failed. Please try again.");
    } finally {
      setIsRunning(false);
    }
  };

  // Mock Data for Diagnostics
  const healthScore = 78;
  
  const clientConcentrationData = [
    { name: "Acme Corp", value: 45, color: "#4f46e5" },
    { name: "Global Tech", value: 25, color: "#6366f1" },
    { name: "Zest Foods", value: 15, color: "#818cf8" },
    { name: "Others", value: 15, color: "#c7d2fe" },
  ];

  const efficiencyData = [
    { category: "Design", estimated: 100, actual: 115 },
    { category: "Dev", estimated: 200, actual: 180 },
    { category: "Strategy", estimated: 50, actual: 45 },
    { category: "Admin", estimated: 40, actual: 65 },
  ];

  const diagnostics = [
    {
      title: "Financial Vitality",
      score: 85,
      status: "Healthy",
      metric: "32% Net Margin",
      trend: "up",
      description: "Your profitability is in the top 10% for boutique agencies. Cash reserves cover 4 months of operations."
    },
    {
      title: "Client Dependency",
      score: 42,
      status: "High Risk",
      metric: "45% Single Client",
      trend: "down",
      description: "Acme Corp accounts for nearly half of your revenue. A contract termination would be catastrophic."
    },
    {
      title: "Operational Efficiency",
      score: 68,
      status: "Warning",
      metric: "12% Scope Leak",
      trend: "down",
      description: "Administrative overhead and unbilled revisions are eating into project margins on design tasks."
    },
    {
      title: "Pipeline Velocity",
      score: 92,
      status: "Excellent",
      metric: "14d Avg. Close",
      trend: "up",
      description: "Your proposal-to-contract speed is exceptional. High market demand detected for your UI/UX services."
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Business Diagnostics</h1>
            <p className="text-slate-500">Professional health audit and strategic risk assessment.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-slate-200">Export Audit PDF</Button>
            <Button
              className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-100 gap-2"
              onClick={handleRunDiagnostic}
              disabled={isRunning}
            >
              {isRunning ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing...</> : <><Sparkles className="w-4 h-4" /> Run AI Diagnostic</>}
            </Button>
          </div>
        </div>

        {/* Overall Health Score Gauge */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-1 border-none shadow-sm bg-slate-900 text-white overflow-hidden relative">
            <CardContent className="p-8 flex flex-col items-center text-center relative z-10">
              <p className="text-indigo-300 text-xs font-bold uppercase tracking-widest mb-6">Overall Health Score</p>
              <div className="relative w-48 h-48 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="transparent"
                    className="text-slate-800"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="transparent"
                    strokeDasharray={553}
                    strokeDashoffset={553 - (553 * healthScore) / 100}
                    className="text-indigo-500 transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-black">{healthScore}</span>
                  <span className="text-xs font-bold text-indigo-300">STABLE</span>
                </div>
              </div>
              <div className="mt-8 space-y-2">
                <p className="text-sm text-slate-400">Your business is performing better than <span className="text-white font-bold">72%</span> of similar agencies.</p>
              </div>
            </CardContent>
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/20 rounded-full blur-3xl -mr-16 -mt-16" />
          </Card>

          {/* Pillar Scores */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            {diagnostics.map((d) => (
              <Card key={d.title} className="border-none shadow-sm hover:shadow-md transition-all">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{d.title}</p>
                      <h3 className="text-xl font-bold text-slate-900">{d.metric}</h3>
                    </div>
                    <Badge className={cn(
                      "border-none px-2 py-1",
                      d.status === "Healthy" ? "bg-emerald-50 text-emerald-700" :
                      d.status === "High Risk" ? "bg-rose-50 text-rose-700" :
                      d.status === "Warning" ? "bg-amber-50 text-amber-700" : "bg-indigo-50 text-indigo-700"
                    )}>
                      {d.status}
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-500">Pillar Score</span>
                      <span className="text-slate-900">{d.score}/100</span>
                    </div>
                    <Progress value={d.score} className={cn(
                      "h-1.5 bg-slate-100",
                      d.score > 80 ? "[&>div]:bg-emerald-500" : 
                      d.score < 50 ? "[&>div]:bg-rose-500" : "[&>div]:bg-amber-500"
                    )} />
                    <p className="text-xs text-slate-500 leading-relaxed">{d.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Deep Dive Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Client Concentration Analysis */}
          <Card className="border-none shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2 mb-1">
                <ShieldAlert className="w-4 h-4 text-rose-500" />
                <CardTitle className="text-lg font-bold">Revenue Concentration Audit</CardTitle>
              </div>
              <CardDescription>Analyzing risk exposure across your client portfolio.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full flex items-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={clientConcentrationData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {clientConcentrationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend verticalAlign="middle" align="right" layout="vertical" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 p-4 bg-rose-50 rounded-xl border border-rose-100">
                <div className="flex gap-3">
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                  <p className="text-sm text-rose-900">
                    <span className="font-bold">Critical Risk:</span> Your top client accounts for 45% of revenue. We recommend acquiring 2 new clients in the $2k-$5k range to dilute this dependency.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Operational Efficiency Audit */}
          <Card className="border-none shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-4 h-4 text-amber-500" />
                <CardTitle className="text-lg font-bold">Efficiency & Margin Audit</CardTitle>
              </div>
              <CardDescription>Estimated vs. Actual resource utilization by service line.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={efficiencyData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                    <Tooltip 
                      cursor={{fill: '#f8fafc'}}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend />
                    <Bar dataKey="estimated" name="Est. Hours" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="actual" name="Actual Hours" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-100">
                <div className="flex gap-3">
                  <Lightbulb className="w-5 h-5 text-amber-600 shrink-0" />
                  <p className="text-sm text-amber-900">
                    <span className="font-bold">Efficiency Insight:</span> Design tasks are consistently overrunning by 15%. Consider implementing a "Change Order" for revisions beyond the second round.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Strategic Recommendations */}
        <Card className="border-none shadow-sm bg-indigo-600 text-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-6 h-6" />
                  Strategic Growth Roadmap
                </CardTitle>
                <CardDescription className="text-indigo-100 mt-1">AI-powered recommendations based on your diagnostic scores.</CardDescription>
              </div>
              <Button
                onClick={handleRunDiagnostic}
                disabled={isRunning}
                className="bg-white/20 hover:bg-white/30 text-white border-none gap-2 shrink-0"
                size="sm"
              >
                {isRunning ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                {aiReco ? "Refresh" : "Generate"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {aiReco ? (
              <div className="bg-white/10 rounded-2xl p-6 border border-white/10">
                <p className="text-sm text-indigo-100 leading-relaxed whitespace-pre-line">{aiReco}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { step: "01", title: "Diversify Revenue", action: "Launch a 'Quick Audit' service at $999 to attract 3-5 smaller clients this quarter.", impact: "Reduces Concentration Risk" },
                  { step: "02", title: "Optimize Margins", action: "Automate client onboarding using the Questionnaire Builder to save 4 hours per project.", impact: "Increases Operational Score" },
                  { step: "03", title: "Scale Pricing", action: "Increase your hourly rate by 15% for all new proposals starting next month.", impact: "Boosts Financial Vitality" }
                ].map((rec) => (
                  <div key={rec.step} className="bg-white/10 rounded-2xl p-6 border border-white/10 hover:bg-white/20 transition-colors">
                    <span className="text-3xl font-black opacity-30 mb-4 block">{rec.step}</span>
                    <h4 className="font-bold text-lg mb-2">{rec.title}</h4>
                    <p className="text-sm text-indigo-100 mb-4 leading-relaxed">{rec.action}</p>
                    <Badge className="bg-white text-indigo-600 border-none font-bold text-[10px]">{rec.impact}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default BusinessDiagnostics;