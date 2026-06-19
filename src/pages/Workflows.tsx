"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  Zap, 
  Plus, 
  Play, 
  Settings, 
  Trash2, 
  ArrowRight, 
  Mail, 
  UserPlus, 
  FileText, 
  CreditCard,
  Clock,
  MoreVertical,
  Sparkles,
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { showSuccess } from "@/utils/toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Workflows = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [workflows, setWorkflows] = useState([
    { 
      id: 1, 
      name: "New Lead Onboarding", 
      trigger: "Lead Status → Qualified", 
      actions: ["Send Welcome Email", "Create Onboarding Questionnaire"],
      active: true,
      runs: 12
    },
    { 
      id: 2, 
      name: "Contract Signed Automation", 
      trigger: "Contract → Signed", 
      actions: ["Create Project", "Send Deposit Invoice", "Notify Team"],
      active: true,
      runs: 8
    },
    { 
      id: 3, 
      name: "Payment Reminder", 
      trigger: "Invoice → Overdue (3 days)", 
      actions: ["Send Reminder Email"],
      active: false,
      runs: 45
    }
  ]);

  const toggleWorkflow = (id: number) => {
    setWorkflows(workflows.map(w => 
      w.id === id ? { ...w, active: !w.active } : w
    ));
    showSuccess("Workflow status updated.");
  };

  const handleCreateWorkflow = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get("name") as string;
    const trigger = formData.get("trigger") as string;

    const newWorkflow = {
      id: Date.now(),
      name: name || "Untitled Workflow",
      trigger: trigger || "Manual Trigger",
      actions: ["Custom Action"],
      active: true,
      runs: 0
    };

    setWorkflows([newWorkflow, ...workflows]);
    setIsCreateOpen(false);
    showSuccess("New workflow created successfully!");
  };

  const simulateAIGeneration = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const aiWorkflow = {
        id: Date.now(),
        name: "AI: Smart Follow-up",
        trigger: "Proposal → Viewed (No response 24h)",
        actions: ["Send Gentle Reminder", "Notify Slack", "Schedule Call"],
        active: true,
        runs: 0
      };
      setWorkflows([aiWorkflow, ...workflows]);
      setIsGenerating(false);
      setIsCreateOpen(false);
      showSuccess("AI generated a smart follow-up workflow for you!");
    }, 1500);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Workflows & Automations</h1>
            <p className="text-slate-500">Automate your business processes with custom triggers and actions.</p>
          </div>
          
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 shadow-lg shadow-emerald-100">
                <Plus className="w-4 h-4" />
                Create Workflow
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] border-none shadow-2xl rounded-3xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">Create New Workflow</DialogTitle>
                <DialogDescription>
                  Set up a trigger and a series of actions to automate your work.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateWorkflow} className="space-y-6 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="font-bold text-slate-700">Workflow Name</Label>
                  <Input id="name" name="name" placeholder="e.g. Post-Project Feedback" className="rounded-xl border-slate-200" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="trigger" className="font-bold text-slate-700">Trigger Event</Label>
                  <Select name="trigger">
                    <SelectTrigger className="rounded-xl border-slate-200">
                      <SelectValue placeholder="Select a trigger" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Lead Created">New Lead Created</SelectItem>
                      <SelectItem value="Contract Signed">Contract Signed</SelectItem>
                      <SelectItem value="Invoice Paid">Invoice Paid</SelectItem>
                      <SelectItem value="Project Completed">Project Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-emerald-600">
                      <Sparkles className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-wider">AI Assistant</span>
                    </div>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      className="text-emerald-600 hover:bg-emerald-100 h-7 text-xs font-bold"
                      onClick={simulateAIGeneration}
                      disabled={isGenerating}
                    >
                      {isGenerating ? "Generating..." : "Generate with AI"}
                    </Button>
                  </div>
                  <p className="text-xs text-emerald-700 leading-relaxed">
                    Not sure what to automate? Let our AI suggest a workflow based on your recent business activity.
                  </p>
                </div>

                <DialogFooter>
                  <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-6 font-bold">
                    Create Workflow
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Automation Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-none shadow-sm bg-emerald-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-white/10">
                  <Zap className="w-5 h-5" />
                </div>
                <Badge className="bg-white/20 text-white border-none">Active</Badge>
              </div>
              <p className="text-emerald-100 text-sm font-medium">Total Automations Run</p>
              <h3 className="text-3xl font-bold">1,240</h3>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                  <Clock className="w-5 h-5" />
                </div>
              </div>
              <p className="text-sm font-medium text-slate-500">Time Saved (Monthly)</p>
              <h3 className="text-3xl font-bold text-slate-900">18.5 Hours</h3>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                  <Play className="w-5 h-5" />
                </div>
              </div>
              <p className="text-sm font-medium text-slate-500">Active Workflows</p>
              <h3 className="text-3xl font-bold text-slate-900">{workflows.filter(w => w.active).length}</h3>
            </CardContent>
          </Card>
        </div>

        {/* Workflow List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900">Active Workflows</h3>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="text-slate-500 font-bold">All</Button>
              <Button variant="ghost" size="sm" className="text-slate-400">Drafts</Button>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {workflows.map((workflow) => (
              <Card key={workflow.id} className="border-none shadow-sm hover:shadow-md transition-all group">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4 min-w-[300px]">
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center",
                        workflow.active ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"
                      )}>
                        <Zap className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">{workflow.name}</h4>
                          {workflow.name.startsWith("AI:") && (
                            <Badge className="bg-emerald-100 text-emerald-700 border-none text-[10px] px-1.5 py-0">AI</Badge>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <Play className="w-3 h-3" /> Trigger: {workflow.trigger}
                        </p>
                      </div>
                    </div>

                    <div className="flex-1 flex flex-wrap gap-2">
                      {workflow.actions.map((action, i) => (
                        <Badge key={i} variant="secondary" className="bg-slate-50 text-slate-600 border-none text-[10px] px-2 py-1">
                          {action}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Runs</p>
                        <p className="font-bold text-slate-900">{workflow.runs}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <Switch 
                          checked={workflow.active} 
                          onCheckedChange={() => toggleWorkflow(workflow.id)}
                        />
                        <Button variant="ghost" size="icon" className="text-slate-400">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Automation Templates */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900">Recommended Templates</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Lead to Client", desc: "Automate the entire journey from lead capture to signed contract.", icon: UserPlus, color: "bg-blue-500" },
              { title: "Project Kickoff", desc: "Create folders, tasks, and notify team when a project starts.", icon: FileText, color: "bg-emerald-500" },
              { title: "Late Payment Recovery", desc: "Escalate reminders and notify you when invoices are overdue.", icon: CreditCard, color: "bg-rose-500" },
            ].map((template) => (
              <Card key={template.title} className="border-none shadow-sm hover:shadow-md transition-all cursor-pointer group">
                <CardContent className="p-6">
                  <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center text-white mb-4 shadow-lg", template.color)}>
                    <template.icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">{template.title}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed mb-4">{template.desc}</p>
                  <Button variant="ghost" size="sm" className="p-0 text-emerald-600 hover:bg-transparent font-bold gap-1">
                    Use Template <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
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

export default Workflows;