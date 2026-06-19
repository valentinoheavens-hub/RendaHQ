"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Zap,
  Plus,
  Mail,
  Clock,
  CreditCard,
  FileText,
  Users,
  ToggleLeft,
  ToggleRight,
  Sparkles,
  Loader2,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Bell,
  ArrowRight,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { suggestAutomations } from "@/lib/ai";
import { showSuccess, showError } from "@/utils/toast";

interface Automation {
  id: string;
  name: string;
  trigger: string;
  action: string;
  category: string;
  enabled: boolean;
  runs: number;
  lastRun?: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  Invoicing: "bg-emerald-50 text-emerald-700",
  Leads: "bg-blue-50 text-blue-700",
  Clients: "bg-violet-50 text-violet-700",
  Projects: "bg-amber-50 text-amber-700",
  General: "bg-slate-100 text-slate-600",
};

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  Invoicing: CreditCard,
  Leads: Users,
  Clients: Users,
  Projects: FileText,
  General: Zap,
};

const defaultAutomations: Automation[] = [
  {
    id: "1",
    name: "Overdue Invoice Reminder",
    trigger: "Invoice is overdue by 3 days",
    action: "Send payment reminder email to client",
    category: "Invoicing",
    enabled: true,
    runs: 12,
    lastRun: "2 days ago",
  },
  {
    id: "2",
    name: "New Lead Welcome",
    trigger: "New lead is added to pipeline",
    action: "Draft and send personalized intro email",
    category: "Leads",
    enabled: true,
    runs: 28,
    lastRun: "1 hour ago",
  },
  {
    id: "3",
    name: "Project Completion Handoff",
    trigger: "Project status changes to Completed",
    action: "Send client satisfaction survey + invoice final payment",
    category: "Projects",
    enabled: false,
    runs: 4,
    lastRun: "1 week ago",
  },
  {
    id: "4",
    name: "Contract Signature Follow-up",
    trigger: "Contract is sent but not signed after 48h",
    action: "Send a gentle nudge email to client",
    category: "Clients",
    enabled: true,
    runs: 7,
    lastRun: "3 days ago",
  },
];

const TRIGGER_OPTIONS = [
  "Invoice is overdue by 3 days",
  "Invoice is overdue by 7 days",
  "New lead added to pipeline",
  "Lead stage changes to Proposal",
  "Contract sent but unsigned after 48h",
  "Project status changes to Completed",
  "Client hasn't responded in 5 days",
  "New message received from client",
];

const ACTION_OPTIONS = [
  "Send payment reminder email",
  "Draft personalized intro email",
  "Send contract nudge email",
  "Send client satisfaction survey",
  "Create follow-up task",
  "Send Slack notification to team",
  "Generate invoice",
  "Send project completion email",
];

export default function Automations() {
  const [automations, setAutomations] = useState<Automation[]>(defaultAutomations);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newTrigger, setNewTrigger] = useState("");
  const [newAction, setNewAction] = useState("");
  const [newCategory, setNewCategory] = useState("General");
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<any[]>([]);

  const toggleAutomation = (id: string) => {
    setAutomations(prev =>
      prev.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a)
    );
    const auto = automations.find(a => a.id === id);
    showSuccess(auto?.enabled ? "Automation paused" : "Automation activated");
  };

  const deleteAutomation = (id: string) => {
    setAutomations(prev => prev.filter(a => a.id !== id));
    showSuccess("Automation deleted");
  };

  const addAutomation = () => {
    if (!newName || !newTrigger || !newAction) {
      showError("Please fill in all fields");
      return;
    }
    const created: Automation = {
      id: Date.now().toString(),
      name: newName,
      trigger: newTrigger,
      action: newAction,
      category: newCategory,
      enabled: true,
      runs: 0,
    };
    setAutomations(prev => [created, ...prev]);
    setIsDialogOpen(false);
    setNewName(""); setNewTrigger(""); setNewAction(""); setNewCategory("General");
    showSuccess("Automation created!");
  };

  const handleGetAISuggestions = async () => {
    setIsSuggesting(true);
    setAiSuggestions([]);
    try {
      const context = "Freelance design & strategy agency. Clients: startups and SMBs. Services: branding, web design, marketing strategy. Pain points: late invoices, slow lead response, scope creep.";
      const raw = await suggestAutomations(context);
      const parsed = JSON.parse(raw);
      setAiSuggestions(Array.isArray(parsed) ? parsed : []);
    } catch {
      showError("AI suggestions unavailable. Check your API key.");
    } finally {
      setIsSuggesting(false);
    }
  };

  const addFromSuggestion = (s: any) => {
    const auto: Automation = {
      id: Date.now().toString(),
      name: s.action ?? "New Automation",
      trigger: s.trigger ?? "Custom trigger",
      action: s.action ?? "Custom action",
      category: s.category ?? "General",
      enabled: false,
      runs: 0,
    };
    setAutomations(prev => [auto, ...prev]);
    showSuccess("Automation added from AI suggestion!");
  };

  const enabledCount = automations.filter(a => a.enabled).length;
  const totalRuns = automations.reduce((sum, a) => sum + a.runs, 0);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Automations</h1>
            <p className="text-slate-500">Set up trigger-action rules to run your business on autopilot.</p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="gap-2 border-emerald-200 text-emerald-600 hover:bg-emerald-50"
              onClick={handleGetAISuggestions}
              disabled={isSuggesting}
            >
              {isSuggesting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {isSuggesting ? "Thinking…" : "AI Suggestions"}
            </Button>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
              onClick={() => setIsDialogOpen(true)}
            >
              <Plus className="w-4 h-4" />
              New Automation
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                  <Zap className="w-5 h-5" />
                </div>
                <Badge className="bg-emerald-50 text-emerald-700 border-none">{enabledCount} active</Badge>
              </div>
              <p className="text-sm font-medium text-slate-500">Total Automations</p>
              <h3 className="text-2xl font-bold text-slate-900">{automations.length}</h3>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </div>
              <p className="text-sm font-medium text-slate-500">Total Actions Run</p>
              <h3 className="text-2xl font-bold text-slate-900">{totalRuns}</h3>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
                  <Clock className="w-5 h-5" />
                </div>
              </div>
              <p className="text-sm font-medium text-slate-500">Est. Hours Saved</p>
              <h3 className="text-2xl font-bold text-slate-900">{Math.round(totalRuns * 0.3)}h</h3>
            </CardContent>
          </Card>
        </div>

        {/* AI Suggestions Panel */}
        {aiSuggestions.length > 0 && (
          <Card className="border-none shadow-sm bg-emerald-50 border border-emerald-100">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <CardTitle className="text-base font-bold text-emerald-900">AI-Suggested Automations</CardTitle>
              </div>
              <CardDescription className="text-emerald-700">
                Based on your agency profile. Click to add any suggestion.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {aiSuggestions.map((s, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 bg-white rounded-xl border border-emerald-100 hover:border-emerald-300 transition-all"
                >
                  <div className="flex-1 min-w-0 mr-4">
                    <p className="text-sm font-bold text-slate-900 mb-0.5">{s.action}</p>
                    <p className="text-xs text-slate-500">
                      <span className="font-medium text-emerald-600">When:</span> {s.trigger} ·{" "}
                      <span className="font-medium text-emerald-600">Benefit:</span> {s.benefit}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="shrink-0 border-emerald-200 text-emerald-600 hover:bg-emerald-50 gap-1.5 text-xs"
                    onClick={() => addFromSuggestion(s)}
                  >
                    <Plus className="w-3.5 h-3.5" /> Add
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Automation List */}
        <div className="space-y-4">
          <h2 className="font-bold text-slate-900">Your Automations</h2>
          {automations.map((auto) => {
            const Icon = CATEGORY_ICONS[auto.category] ?? Zap;
            return (
              <Card key={auto.id} className={cn(
                "border-none shadow-sm transition-all",
                !auto.enabled && "opacity-60"
              )}>
                <CardContent className="p-5">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                      auto.enabled ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"
                    )}>
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-slate-900 text-sm">{auto.name}</h3>
                        <Badge className={cn("border-none text-[10px]", CATEGORY_COLORS[auto.category] ?? CATEGORY_COLORS.General)}>
                          {auto.category}
                        </Badge>
                        {!auto.enabled && (
                          <Badge className="border-none text-[10px] bg-slate-100 text-slate-500">Paused</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="font-medium text-slate-700">When:</span> {auto.trigger}
                        <ArrowRight className="w-3 h-3 text-slate-300" />
                        <span className="font-medium text-slate-700">Then:</span> {auto.action}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right hidden md:block">
                        <p className="text-xs font-bold text-slate-900">{auto.runs} runs</p>
                        {auto.lastRun && (
                          <p className="text-[10px] text-slate-400">Last: {auto.lastRun}</p>
                        )}
                      </div>
                      <button
                        onClick={() => toggleAutomation(auto.id)}
                        className={cn(
                          "w-10 h-6 rounded-full transition-all relative",
                          auto.enabled ? "bg-emerald-600" : "bg-slate-200"
                        )}
                      >
                        <span className={cn(
                          "absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all",
                          auto.enabled ? "left-5" : "left-1"
                        )} />
                      </button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-slate-300 hover:text-rose-500 h-8 w-8"
                        onClick={() => deleteAutomation(auto.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Create Automation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-3xl border-none shadow-2xl p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-0">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center">
                <Zap className="w-4 h-4 text-emerald-600" />
              </div>
              <DialogTitle className="text-lg font-bold">Create Automation</DialogTitle>
            </div>
            <DialogDescription>
              Define a trigger and an action. RendaHQ will run this automatically.
            </DialogDescription>
          </DialogHeader>
          <div className="p-6 space-y-5">
            <div className="space-y-2">
              <Label>Automation Name</Label>
              <Input
                placeholder="e.g. Overdue Invoice Reminder"
                value={newName}
                onChange={e => setNewName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Trigger — When this happens…</Label>
              <Select value={newTrigger} onValueChange={setNewTrigger}>
                <SelectTrigger className="border-slate-200">
                  <SelectValue placeholder="Choose a trigger" />
                </SelectTrigger>
                <SelectContent>
                  {TRIGGER_OPTIONS.map(t => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Action — Do this…</Label>
              <Select value={newAction} onValueChange={setNewAction}>
                <SelectTrigger className="border-slate-200">
                  <SelectValue placeholder="Choose an action" />
                </SelectTrigger>
                <SelectContent>
                  {ACTION_OPTIONS.map(a => (
                    <SelectItem key={a} value={a}>{a}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={newCategory} onValueChange={setNewCategory}>
                <SelectTrigger className="border-slate-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(CATEGORY_COLORS).map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                className="flex-1 border-slate-200"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={addAutomation}
              >
                Create Automation
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
