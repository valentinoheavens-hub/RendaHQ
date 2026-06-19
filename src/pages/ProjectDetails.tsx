import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import TaskBoard from "@/components/projects/TaskBoard";
import {
  ChevronLeft,
  Plus,
  CheckCircle2,
  Clock,
  FileText,
  MoreHorizontal,
  ArrowUpRight,
  MessageSquare,
  Loader2,
  Trash2,
  Pencil,
  Check,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { projectStore, Project, Milestone } from "@/lib/projectStore";
import { useCurrency } from "@/hooks/useCurrency";
import { toast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const STATUS_COLORS: Record<string, string> = {
  "In Progress":  "bg-blue-50 text-blue-700",
  "Active":       "bg-emerald-50 text-emerald-700",
  "Under Review": "bg-amber-50 text-amber-700",
  "Completed":    "bg-emerald-50 text-emerald-700",
  "Onboarding":   "bg-purple-50 text-purple-700",
  "On Hold":      "bg-slate-100 text-slate-600",
  "Cancelled":    "bg-rose-50 text-rose-700",
};

const MILESTONE_STATUSES = ["Not Started", "In Progress", "Under Review", "Approved", "Done"] as const;

const ProjectDetails = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { formatAmount } = useCurrency();

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingProgress, setEditingProgress] = useState(false);
  const [progressDraft, setProgressDraft] = useState(0);
  const [editingStatus, setEditingStatus] = useState(false);
  const [newMilestoneTitle, setNewMilestoneTitle] = useState("");
  const [addingMilestone, setAddingMilestone] = useState(false);

  useEffect(() => {
    if (!projectId) return;
    projectStore.getById(projectId).then((data) => {
      setProject(data);
      setLoading(false);
    });
  }, [projectId]);

  const saveProgress = async () => {
    if (!project) return;
    const updated = await projectStore.update(project.id, { progress: progressDraft });
    if (updated) {
      setProject(updated);
      toast({ title: "Progress updated" });
    }
    setEditingProgress(false);
  };

  const saveStatus = async (status: string) => {
    if (!project) return;
    const updated = await projectStore.update(project.id, { status });
    if (updated) setProject(updated);
    setEditingStatus(false);
  };

  const updateMilestoneStatus = async (milestoneId: string, status: string) => {
    if (!project) return;
    const milestones = project.milestones.map((m) =>
      m.id === milestoneId ? { ...m, status: status as Milestone["status"] } : m
    );
    const updated = await projectStore.update(project.id, { milestones });
    if (updated) setProject(updated);
  };

  const addMilestone = async () => {
    if (!project || !newMilestoneTitle.trim()) return;
    const milestones = [
      ...project.milestones,
      {
        id: crypto.randomUUID(),
        title: newMilestoneTitle.trim(),
        date: "",
        status: "Not Started" as const,
      },
    ];
    const updated = await projectStore.update(project.id, { milestones });
    if (updated) {
      setProject(updated);
      setNewMilestoneTitle("");
      setAddingMilestone(false);
    }
  };

  const removeMilestone = async (milestoneId: string) => {
    if (!project) return;
    const milestones = project.milestones.filter((m) => m.id !== milestoneId);
    const updated = await projectStore.update(project.id, { milestones });
    if (updated) setProject(updated);
  };

  const handleDelete = async () => {
    if (!project) return;
    if (!window.confirm(`Delete "${project.name}"? This cannot be undone.`)) return;
    await projectStore.remove(project.id);
    navigate("/projects");
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20 text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          Loading project...
        </div>
      </DashboardLayout>
    );
  }

  if (!project) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-slate-500 mb-4">Project not found.</p>
          <Link to="/projects">
            <Button variant="outline">Back to Projects</Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const budgetUsedPct = project.budget > 0
    ? Math.min(100, Math.round((project.spent / project.budget) * 100))
    : 0;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link to="/projects">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900">{project.name}</h1>
              {editingStatus ? (
                <Select defaultValue={project.status} onValueChange={saveStatus}>
                  <SelectTrigger className="w-36 h-7 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(STATUS_COLORS).map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Badge
                  className={cn("border-none cursor-pointer", STATUS_COLORS[project.status] ?? "bg-slate-100 text-slate-600")}
                  onClick={() => setEditingStatus(true)}
                  title="Click to change status"
                >
                  {project.status}
                </Badge>
              )}
            </div>
            <p className="text-slate-500">
              {project.client_name ? `Client: ${project.client_name}` : "No client assigned"}
              {project.description ? ` • ${project.description}` : ""}
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-slate-200 text-rose-600 hover:bg-rose-50" onClick={handleDelete}>
              <Trash2 className="w-4 h-4" />
            </Button>
            <Link to={`/project/${projectId}/change-order`}>
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
                <Plus className="w-4 h-4" />
                New Change Order
              </Button>
            </Link>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <p className="text-sm font-medium text-slate-500 mb-1">Project Progress</p>
              <div className="flex items-end justify-between mb-3">
                {editingProgress ? (
                  <div className="flex items-center gap-2 flex-1">
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={progressDraft}
                      onChange={(e) => setProgressDraft(Number(e.target.value))}
                      className="w-20 h-8 text-sm"
                    />
                    <span className="text-slate-400 text-sm">%</span>
                    <Button size="icon" className="h-7 w-7 bg-emerald-600" onClick={saveProgress}>
                      <Check className="w-3 h-3" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setEditingProgress(false)}>
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <h3 className="text-2xl font-bold text-slate-900">{project.progress}%</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-slate-400"
                      onClick={() => { setProgressDraft(project.progress); setEditingProgress(true); }}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                  </>
                )}
              </div>
              <Progress value={project.progress} className="h-2 bg-slate-100" />
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <p className="text-sm font-medium text-slate-500 mb-1">Budget Utilization</p>
              <div className="flex items-end justify-between mb-3">
                <h3 className="text-2xl font-bold text-slate-900">
                  {formatAmount(project.spent)} / {formatAmount(project.budget)}
                </h3>
                <Badge
                  variant="secondary"
                  className={cn(
                    "border-none",
                    budgetUsedPct > 90 ? "bg-rose-50 text-rose-700" :
                    budgetUsedPct > 70 ? "bg-amber-50 text-amber-700" :
                    "bg-emerald-50 text-emerald-700"
                  )}
                >
                  {budgetUsedPct}% used
                </Badge>
              </div>
              <Progress value={budgetUsedPct} className="h-2 bg-slate-100" />
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <p className="text-sm font-medium text-slate-500 mb-1">Milestones</p>
              <h3 className="text-2xl font-bold text-slate-900 mb-1">
                {project.milestones.filter((m) => m.status === "Approved" || m.status === "Done").length}
                <span className="text-base font-normal text-slate-400"> / {project.milestones.length}</span>
              </h3>
              <p className="text-xs text-slate-500">
                {project.due_date
                  ? `Due ${new Date(project.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
                  : "No due date set"}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Tasks */}
            <Card className="border-none shadow-sm">
              <CardContent className="p-6">
                <TaskBoard />
              </CardContent>
            </Card>

            {/* Milestones */}
            <Card className="border-none shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-bold">Milestones & Deliverables</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-emerald-600"
                  onClick={() => setAddingMilestone(true)}
                >
                  <Plus className="w-4 h-4 mr-1" /> Add
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {project.milestones.length === 0 && !addingMilestone && (
                  <p className="text-sm text-slate-400 text-center py-6">No milestones yet.</p>
                )}
                {project.milestones.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-emerald-100 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center",
                        m.status === "Approved" || m.status === "Done"
                          ? "bg-emerald-50 text-emerald-600"
                          : m.status === "Under Review"
                          ? "bg-amber-50 text-amber-600"
                          : "bg-slate-100 text-slate-400"
                      )}>
                        {m.status === "Approved" || m.status === "Done"
                          ? <CheckCircle2 className="w-5 h-5" />
                          : <Clock className="w-5 h-5" />}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{m.title}</h4>
                        {m.date && <p className="text-xs text-slate-500">Due {m.date}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Select
                        value={m.status}
                        onValueChange={(val) => updateMilestoneStatus(m.id, val)}
                      >
                        <SelectTrigger className="h-7 w-32 text-xs border-none bg-slate-50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {MILESTONE_STATUSES.map((s) => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-slate-300 hover:text-rose-500 h-7 w-7"
                        onClick={() => removeMilestone(m.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
                {addingMilestone && (
                  <div className="flex gap-2 items-center p-3 rounded-xl bg-slate-50">
                    <Input
                      placeholder="Milestone title..."
                      value={newMilestoneTitle}
                      onChange={(e) => setNewMilestoneTitle(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addMilestone()}
                      className="flex-1 h-8 text-sm"
                      autoFocus
                    />
                    <Button size="icon" className="h-8 w-8 bg-emerald-600" onClick={addMilestone}>
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setAddingMilestone(false)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Project Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Billing</span>
                  <span className="font-medium text-slate-900">{project.billing_method}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Budget</span>
                  <span className="font-medium text-slate-900">{formatAmount(project.budget)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Spent</span>
                  <span className="font-medium text-slate-900">{formatAmount(project.spent)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Health</span>
                  <span className={cn(
                    "font-bold",
                    project.health === "Healthy" ? "text-emerald-600" :
                    project.health === "At Risk" ? "text-amber-600" : "text-rose-600"
                  )}>
                    {project.health}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Created</span>
                  <span className="text-slate-900">
                    {new Date(project.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-emerald-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare className="w-5 h-5" />
                  <h4 className="font-bold">Client Chat</h4>
                </div>
                <p className="text-emerald-100 text-sm mb-4">
                  Centralize all project communication to avoid email threads.
                </p>
                <Link to="/messages">
                  <Button className="w-full bg-white text-emerald-600 hover:bg-emerald-50 border-none">
                    Open Message Thread
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProjectDetails;
