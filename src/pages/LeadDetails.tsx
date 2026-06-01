"use client";

import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import {
  ChevronLeft,
  Mail,
  Phone,
  Globe,
  DollarSign,
  TrendingUp,
  FileSignature,
  Zap,
  Clock,
  Sparkles,
  Loader2,
  Copy,
  Check,
  AlertTriangle,
  ShieldCheck,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { showSuccess, showError } from "@/utils/toast";
import { analyzeLeadData, generateEmailDraft, type LeadAnalysis } from "@/lib/ai";

const LeadDetails = () => {
  const { leadId } = useParams();
  const navigate = useNavigate();

  const [analysis, setAnalysis] = useState<LeadAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [emailDraft, setEmailDraft] = useState("");
  const [isDraftingEmail, setIsDraftingEmail] = useState(false);
  const [copied, setCopied] = useState(false);

  // Mock data for a specific lead
  const lead = {
    id: "1",
    name: "TechFlow Solutions",
    contact: "Alex Rivera",
    role: "CEO & Founder",
    email: "alex@techflow.io",
    phone: "+1 (555) 123-4567",
    website: "www.techflow.io",
    value: "$12,000",
    stage: "Discovery",
    source: "Referral",
    probability: 65,
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=TF",
    description: "Looking for a complete brand overhaul and a high-performance marketing site for their Series A launch.",
    timeline: [
      { date: "Oct 28", action: "Initial discovery call completed", type: "call" },
      { date: "Oct 26", action: "Lead captured via referral", type: "source" },
      { date: "Oct 27", action: "Sent introductory deck", type: "email" }
    ]
  };

  const handleAnalyzeLead = async () => {
    if (isAnalyzing) return;
    setIsAnalyzing(true);
    setAnalysis(null);
    try {
      const result = await analyzeLeadData({
        leadName: lead.name,
        contactName: lead.contact,
        dealValue: lead.value,
        stage: lead.stage,
        source: lead.source,
        description: lead.description,
        timeline: lead.timeline.map(t => `${t.date}: ${t.action}`),
      });
      setAnalysis(result);
      if (result.draftEmail) {
        setEmailDraft(result.draftEmail);
      }
    } catch (err: any) {
      showError(err.message ?? "AI analysis failed");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDraftEmail = async () => {
    if (isDraftingEmail) return;
    setIsDraftingEmail(true);
    try {
      const draft = await generateEmailDraft({
        recipientName: lead.contact,
        recipientCompany: lead.name,
        context: `Follow up after a discovery call. The client is looking for: ${lead.description}. Deal value: ${lead.value}. Source: ${lead.source}.`,
        senderName: "Felix",
        tone: "professional",
      });
      setEmailDraft(draft);
    } catch (err: any) {
      showError(err.message ?? "Email draft failed");
    } finally {
      setIsDraftingEmail(false);
    }
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(emailDraft);
    setCopied(true);
    showSuccess("Email copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendProposal = () => {
    showSuccess("Redirecting to proposal builder…");
    navigate("/proposal/new");
  };

  const riskColor = (level?: string) => {
    if (level === "Low") return "bg-emerald-50 text-emerald-700";
    if (level === "High") return "bg-rose-50 text-rose-700";
    return "bg-amber-50 text-amber-700";
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Link to="/leads">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16 rounded-2xl border-2 border-white shadow-md">
              <AvatarImage src={lead.avatar} />
              <AvatarFallback>TF</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-slate-900">{lead.name}</h1>
                <Badge className="bg-blue-50 text-blue-700 border-none">{lead.stage}</Badge>
              </div>
              <p className="text-slate-500">{lead.contact} · {lead.role}</p>
            </div>
          </div>
          <div className="ml-auto flex gap-3">
            <Button variant="outline" className="border-slate-200 gap-2" onClick={handleDraftEmail} disabled={isDraftingEmail}>
              {isDraftingEmail ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
              {isDraftingEmail ? "Drafting…" : "Draft Email"}
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2" onClick={handleSendProposal}>
              <FileSignature className="w-4 h-4" />
              Create Proposal
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Deal Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-500">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-sm font-medium">Estimated Value</span>
                  </div>
                  <span className="font-bold text-slate-900">{lead.value}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <span>Win Probability</span>
                    <span className="text-slate-900">
                      {analysis ? `${analysis.probability}%` : `${lead.probability}%`}
                    </span>
                  </div>
                  <Progress
                    value={analysis ? analysis.probability : lead.probability}
                    className="h-1.5 bg-slate-100 [&>div]:bg-indigo-500"
                  />
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-2 text-slate-500">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-medium">Source</span>
                  </div>
                  <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-none">
                    {lead.source}
                  </Badge>
                </div>
                {analysis && (
                  <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                    <div className="flex items-center gap-2 text-slate-500">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="text-sm font-medium">Risk Level</span>
                    </div>
                    <Badge className={cn("border-none", riskColor(analysis.riskLevel))}>
                      {analysis.riskLevel}
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Contact Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600">{lead.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600">{lead.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Globe className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600">{lead.website}</span>
                </div>
              </CardContent>
            </Card>

            {/* AI Sales Assistant Card */}
            <Card className={cn(
              "border-none shadow-sm transition-all",
              analysis ? "bg-slate-50" : "bg-indigo-50 border-indigo-100"
            )}>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 text-indigo-600 mb-3">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">AI Sales Assistant</span>
                </div>

                {!analysis && !isAnalyzing && (
                  <>
                    <p className="text-sm text-indigo-900 font-medium mb-4 leading-relaxed">
                      Get AI-powered insights on this deal — close probability, risk level, next best action, and a ready-to-send email draft.
                    </p>
                    <Button
                      onClick={handleAnalyzeLead}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white gap-2 text-sm"
                    >
                      <Sparkles className="w-4 h-4" />
                      Analyze This Lead
                    </Button>
                  </>
                )}

                {isAnalyzing && (
                  <div className="flex flex-col items-center py-4 gap-3 text-indigo-600">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <p className="text-sm font-medium">Analyzing deal signals…</p>
                  </div>
                )}

                {analysis && !isAnalyzing && (
                  <div className="space-y-4">
                    <div className="p-3 bg-white rounded-xl border border-slate-200">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Insight</p>
                      <p className="text-sm text-slate-700 leading-relaxed">{analysis.insight}</p>
                    </div>
                    <div className="p-3 bg-indigo-600 rounded-xl">
                      <p className="text-[10px] font-bold text-indigo-200 uppercase tracking-wider mb-1">Next Best Action</p>
                      <p className="text-sm text-white font-medium leading-relaxed">{analysis.nextAction}</p>
                    </div>
                    <Button
                      onClick={handleAnalyzeLead}
                      variant="outline"
                      size="sm"
                      className="w-full text-xs border-slate-200"
                    >
                      Refresh Analysis
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="activity" className="w-full">
              <TabsList className="bg-white border border-slate-200 p-1 h-12 mb-6">
                <TabsTrigger value="activity" className="gap-2">Activity Feed</TabsTrigger>
                <TabsTrigger value="email" className="gap-2">
                  Email Draft
                  {emailDraft && (
                    <span className="w-2 h-2 bg-indigo-500 rounded-full" />
                  )}
                </TabsTrigger>
                <TabsTrigger value="notes" className="gap-2">Notes</TabsTrigger>
              </TabsList>

              <TabsContent value="activity" className="space-y-6">
                <div className="relative pl-8 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                  {lead.timeline.map((item, i) => (
                    <div key={i} className="relative">
                      <div className={cn(
                        "absolute -left-8 w-6 h-6 rounded-full border-4 border-white flex items-center justify-center shadow-sm",
                        item.type === "call" ? "bg-blue-500" : item.type === "email" ? "bg-indigo-500" : "bg-slate-400"
                      )}>
                        {item.type === "call" ? <Phone className="w-2.5 h-2.5 text-white" /> :
                          item.type === "email" ? <Mail className="w-2.5 h-2.5 text-white" /> :
                          <Clock className="w-2.5 h-2.5 text-white" />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{item.action}</p>
                        <p className="text-xs text-slate-400">{item.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full border-dashed border-2 border-slate-200 text-slate-500">
                  Log New Activity
                </Button>
              </TabsContent>

              <TabsContent value="email" className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900">Email Draft</h3>
                    <p className="text-sm text-slate-500">AI-generated outreach email to {lead.contact}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDraftEmail}
                      disabled={isDraftingEmail}
                      className="gap-1.5 text-xs border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                    >
                      {isDraftingEmail ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                      {isDraftingEmail ? "Drafting…" : "Generate Draft"}
                    </Button>
                    {emailDraft && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopyEmail}
                        className="gap-1.5 text-xs"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        {copied ? "Copied!" : "Copy"}
                      </Button>
                    )}
                  </div>
                </div>

                {!emailDraft && !isDraftingEmail ? (
                  <Card className="border-dashed border-2 border-slate-200 shadow-none">
                    <CardContent className="py-16 flex flex-col items-center gap-4 text-center">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-indigo-500" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-700 mb-1">No draft yet</p>
                        <p className="text-sm text-slate-400">Click "Generate Draft" to create a personalised outreach email for {lead.contact}.</p>
                      </div>
                      <Button
                        onClick={handleDraftEmail}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 mt-2"
                      >
                        <Sparkles className="w-4 h-4" />
                        Generate with AI
                      </Button>
                    </CardContent>
                  </Card>
                ) : isDraftingEmail ? (
                  <Card className="border-none shadow-sm">
                    <CardContent className="py-16 flex flex-col items-center gap-3">
                      <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                      <p className="text-sm text-slate-500 font-medium">Writing your email…</p>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="border-none shadow-sm">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span className="font-bold text-slate-600">To:</span> {lead.email}
                      </div>
                      <Textarea
                        value={emailDraft}
                        onChange={(e) => setEmailDraft(e.target.value)}
                        className="min-h-[280px] resize-none border-slate-200 focus-visible:ring-indigo-500 text-sm leading-relaxed text-slate-700"
                        placeholder="Your email draft will appear here…"
                      />
                      <div className="flex gap-3 pt-2">
                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 flex-1">
                          <Mail className="w-4 h-4" />
                          Send Email
                        </Button>
                        <Button variant="outline" className="border-slate-200 gap-2" onClick={handleCopyEmail}>
                          {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                          {copied ? "Copied!" : "Copy"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="notes" className="space-y-4">
                <Card className="border-none shadow-sm">
                  <CardContent className="p-6">
                    <h4 className="font-bold text-slate-900 mb-2">Project Requirements</h4>
                    <p className="text-sm text-slate-600 leading-relaxed">{lead.description}</p>
                  </CardContent>
                </Card>
                <Button className="w-full bg-slate-50 text-slate-600 hover:bg-slate-100 border-none">
                  Add Private Note
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LeadDetails;
