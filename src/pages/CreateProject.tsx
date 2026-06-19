import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ChevronRight,
  ChevronLeft,
  Plus,
  Trash2,
  DollarSign,
  Loader2
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { projectStore } from "@/lib/projectStore";
import { clientStore, Client } from "@/lib/clientStore";
import { toast } from "@/components/ui/use-toast";

interface MilestoneRow {
  id: number;
  title: string;
  date: string;
}

const CreateProject = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);

  // Step 1
  const [name, setName] = useState("");
  const [clientId, setClientId] = useState("");
  const [clientName, setClientName] = useState("");
  const [description, setDescription] = useState("");

  // Step 2
  const [milestones, setMilestones] = useState<MilestoneRow[]>([
    { id: 1, title: "Discovery & Research", date: "" },
  ]);

  // Step 3
  const [budget, setBudget] = useState("");
  const [billingMethod, setBillingMethod] = useState("Fixed");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    clientStore.getAll().then(setClients).catch(() => {});
  }, []);

  const addMilestone = () => {
    setMilestones([...milestones, { id: Date.now(), title: "", date: "" }]);
  };

  const removeMilestone = (id: number) => {
    setMilestones(milestones.filter((m) => m.id !== id));
  };

  const updateMilestone = (id: number, field: "title" | "date", value: string) => {
    setMilestones(milestones.map((m) => (m.id === id ? { ...m, [field]: value } : m)));
  };

  const handleClientChange = (id: string) => {
    setClientId(id);
    const c = clients.find((c) => c.id === id);
    setClientName(c?.name ?? "");
  };

  const handleCreate = async () => {
    if (!name.trim()) {
      toast({ title: "Project name is required", variant: "destructive" });
      return;
    }
    setSaving(true);
    const created = await projectStore.create({
      client_id: clientId || null,
      name: name.trim(),
      client_name: clientName,
      description,
      status: "Active",
      progress: 0,
      health: "Healthy",
      budget: parseFloat(budget) || 0,
      spent: 0,
      billing_method: billingMethod,
      due_date: dueDate || null,
      milestones: milestones
        .filter((m) => m.title.trim())
        .map((m) => ({
          id: crypto.randomUUID(),
          title: m.title.trim(),
          date: m.date,
          status: "Not Started" as const,
        })),
    });
    setSaving(false);
    if (created) {
      toast({ title: "Project created!" });
      navigate(`/project/${created.id}`);
    } else {
      toast({ title: "Failed to create project", variant: "destructive" });
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Create New Project</h1>
            <p className="text-slate-500">
              Step {step} of 3:{" "}
              {step === 1 ? "Basic Info" : step === 2 ? "Scope & Milestones" : "Financials"}
            </p>
          </div>
          <div className="flex gap-2">
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                <ChevronLeft className="w-4 h-4 mr-2" /> Back
              </Button>
            )}
            {step < 3 ? (
              <Button
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={() => setStep(step + 1)}
                disabled={step === 1 && !name.trim()}
              >
                Next <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
                onClick={handleCreate}
                disabled={saving}
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                Create Project
              </Button>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-600 transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {step === 1 && (
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>Project Basics</CardTitle>
              <CardDescription>Identify the project and the client it belongs to.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Project Name *</Label>
                <Input
                  placeholder="e.g. Q4 Marketing Campaign"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Client</Label>
                {clients.length > 0 ? (
                  <Select value={clientId} onValueChange={handleClientChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a client" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    placeholder="Client name (no clients added yet)"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                  />
                )}
              </div>
              <div className="space-y-2">
                <Label>Project Description</Label>
                <Textarea
                  placeholder="Briefly describe the project goals..."
                  className="min-h-[100px]"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>Scope & Milestones</CardTitle>
              <CardDescription>Define the key deliverables and their target dates.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {milestones.map((m, index) => (
                  <div key={m.id} className="flex gap-4 items-end p-4 bg-slate-50 rounded-xl">
                    <div className="flex-1 space-y-2">
                      <Label>Milestone {index + 1}</Label>
                      <Input
                        value={m.title}
                        onChange={(e) => updateMilestone(m.id, "title", e.target.value)}
                        placeholder="e.g. Initial Concepts"
                      />
                    </div>
                    <div className="w-40 space-y-2">
                      <Label>Target Date</Label>
                      <Input
                        type="date"
                        value={m.date}
                        onChange={(e) => updateMilestone(m.id, "date", e.target.value)}
                      />
                    </div>
                    {milestones.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-slate-400 hover:text-rose-500"
                        onClick={() => removeMilestone(m.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  variant="outline"
                  className="w-full border-dashed border-2"
                  onClick={addMilestone}
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Milestone
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>Financial Details</CardTitle>
              <CardDescription>Set the budget and billing preferences for this project.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Total Budget</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      className="pl-10"
                      placeholder="0.00"
                      type="number"
                      min="0"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Due Date</Label>
                  <Input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Billing Method</Label>
                <Select value={billingMethod} onValueChange={setBillingMethod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fixed">Fixed Price</SelectItem>
                    <SelectItem value="Hourly">Hourly Rate</SelectItem>
                    <SelectItem value="Retainer">Monthly Retainer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CreateProject;
