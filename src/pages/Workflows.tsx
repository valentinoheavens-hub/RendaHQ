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
  MoreVertical
} from "lucide-react";
import { cn } from "@/lib/utils";
import { showSuccess } from "@/utils/toast";

const Workflows = () => {
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

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Workflows & Automations</h1>
            <p className="text-slate-500">Automate your business processes with custom triggers and actions.</p>
          </div>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 shadow-lg shadow-indigo-100">
            <Plus className="w-4 h-4" />
            Create Workflow
          </Button>
        </div>

        {/* Automation Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-none shadow-sm bg-indigo-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-white/10">
                  <Zap className="w-5 h-5" />
                </div>
                <Badge className="bg-white/20 text-white border-none">Active</Badge>
              </div>
              <p className="text-indigo-100 text-sm font-medium">Total Automations Run</p>
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
              <h3 className="text-3xl font-bold text-slate-900">8</h3>
            </CardContent>
          </Card>
        </div>

        {/* Workflow List */}
        <div className="space-y-4">
          <h3 className="text-xlthink
The user wants me to continue the previous response exactly where it left off.
Looking at the previous response, it ended abruptly at:
`<h3 className="text-xl_`

I need to complete the `Workflows.tsx` file, then update `DashboardLayout.tsx` and `App.tsx`.

Let's finish `src/pages/Workflows.tsx`.

```tsx
          <h3 className="text-xl font-bold text-slate-900">Active Workflows</h3>
          <div className="grid grid-cols-1 gap-4">
            {workflows.map((workflow) => (
              <Card key={workflow.id} className="border-none shadow-sm hover:shadow-md transition-all group">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4 min-w-[300px]">
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center",
                        workflow.active ? "bg-indigo-50 text-indigo-600" : "bg-slate-100 text-slate-400"
                      )}>
                        <Zap className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{workflow.name}</h4>
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
              { title: "Project Kickoff", desc: "Create folders, tasks, and notify team when a project starts.", icon: FileText, color: "bg-indigo-500" },
              { title: "Late Payment Recovery", desc: "Escalate reminders and notify you when invoices are overdue.", icon: CreditCard, color: "bg-rose-500" },
            ].map((template) => (
              <Card key={template.title} className="border-none shadow-sm hover:shadow-md transition-all cursor-pointer group">
                <CardContent className="p-6">
                  <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center text-white mb-4 shadow-lg", template.color)}>
                    <template.icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">{template.title}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed mb-4">{template.desc}</p>
                  <Button variant="ghost" size="sm" className="p-0 text-indigo-600 hover:bg-transparent font-bold gap-1">
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
```

Then update `DashboardLayout.tsx` and `App.tsx`.

Wait, the user said "Continue exactly where you left off without any preamble".
The previous response ended at `<h3 className="text-xl_`.
So I should start with `font-bold text-slate-900">Active Workflows</h3>`?
No, the instructions say "Use <dyad-write> for creating or updating files".
I can't just output text. I must output the full file content in a `<dyad-write>` tag.

So I will rewrite `src/pages/Workflows.tsx` completely, then the other files.

Wait, the user prompt is "Your previous response did not finish completely. Continue exactly where you left off without any preamble."
This usually means I should just provide the code blocks that were missing or cut off.
However, the system instructions say "do NOT be lazy and ALWAYS write the entire file. It needs to be a complete file."

So I will provide the complete `src/pages/Workflows.tsx` file, then the updates to `DashboardLayout.tsx` and `App.tsx`.

Wait, looking at the previous response, it was cut off inside a `<dyad-write>` block.
I should probably just provide the full `<dyad-write>` block for that file and the subsequent ones.

Let's check the previous response's last file: `src/pages/Workflows.tsx`.
It was cut off.

I will provide the full `src/pages/Workflows.tsx`, then `src/components/layout/DashboardLayout.tsx`, then `src/App.tsx`.

Wait, the user said "without any preamble".
So I should start directly with the `<dyad-write>` tags.

One detail: the previous response had a `<think>` block. I should probably not include that if I'm continuing "exactly where I left off", but usually, I should just provide the missing code.

Actually, I'll just provide the full files.

File 1: `src/pages/Workflows.tsx`
File 2: `src/components/layout/DashboardLayout.tsx`
File 3: `src/App.tsx`

Let's go.<dyad-write path="src/pages/Workflows.tsx" description="Completing the Workflows & Automations page.">
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
  MoreVertical
} from "lucide-react";
import { cn } from "@/lib/utils";
import { showSuccess } from "@/utils/toast";

const Workflows = () => {
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

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Workflows & Automations</h1>
            <p className="text-slate-500">Automate your business processes with custom triggers and actions.</p>
          </div>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 shadow-lg shadow-indigo-100">
            <Plus className="w-4 h-4" />
            Create Workflow
          </Button>
        </div>

        {/* Automation Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-none shadow-sm bg-indigo-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-white/10">
                  <Zap className="w-5 h-5" />
                </div>
                <Badge className="bg-white/20 text-white border-none">Active</Badge>
              </div>
              <p className="text-indigo-100 text-sm font-medium">Total Automations Run</p>
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
              <h3 className="text-3xl font-bold text-slate-900">8</h3>
            </CardContent>
          </Card>
        </div>

        {/* Workflow List */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900">Active Workflows</h3>
          <div className="grid grid-cols-1 gap-4">
            {workflows.map((workflow) => (
              <Card key={workflow.id} className="border-none shadow-sm hover:shadow-md transition-all group">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4 min-w-[300px]">
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center",
                        workflow.active ? "bg-indigo-50 text-indigo-600" : "bg-slate-100 text-slate-400"
                      )}>
                        <Zap className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{workflow.name}</h4>
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
              { title: "Project Kickoff", desc: "Create folders, tasks, and notify team when a project starts.", icon: FileText, color: "bg-indigo-500" },
              { title: "Late Payment Recovery", desc: "Escalate reminders and notify you when invoices are overdue.", icon: CreditCard, color: "bg-rose-500" },
            ].map((template) => (
              <Card key={template.title} className="border-none shadow-sm hover:shadow-md transition-all cursor-pointer group">
                <CardContent className="p-6">
                  <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center text-white mb-4 shadow-lg", template.color)}>
                    <template.icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">{template.title}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed mb-4">{template.desc}</p>
                  <Button variant="ghost" size="sm" className="p-0 text-indigo-600 hover:bg-transparent font-bold gap-1">
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