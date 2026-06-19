import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  FolderOpen,
  Loader2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { projectStore, Project } from "@/lib/projectStore";
import { useCurrency } from "@/hooks/useCurrency";

const STATUS_COLORS: Record<string, string> = {
  "In Progress":    "bg-blue-50 text-blue-700",
  "Active":         "bg-emerald-50 text-emerald-700",
  "Under Review":   "bg-amber-50 text-amber-700",
  "Completed":      "bg-emerald-50 text-emerald-700",
  "Onboarding":     "bg-purple-50 text-purple-700",
  "On Hold":        "bg-slate-100 text-slate-600",
  "Cancelled":      "bg-rose-50 text-rose-700",
};

const FILTERS = ["All", "Active", "In Progress", "Under Review", "Completed"];

const Projects = () => {
  const { formatAmount } = useCurrency();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    projectStore.getAll().then((data) => {
      setProjects(data);
      setLoading(false);
    });
  }, []);

  const visible = projects.filter((p) => {
    const matchesFilter = filter === "All" || p.status === filter;
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.client_name.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Projects</h1>
            <p className="text-slate-500">Manage your active work and track project health.</p>
          </div>
          <Link to="/project/new">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
              <Plus className="w-4 h-4" />
              New Project
            </Button>
          </Link>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative flex-1 min-w-48 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search projects or clients..."
              className="pl-10 bg-white border-slate-200"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {FILTERS.map((f) => (
              <Button
                key={f}
                variant={filter === f ? "default" : "ghost"}
                size="sm"
                className={filter === f ? "bg-emerald-600 text-white hover:bg-emerald-700" : "text-slate-500"}
                onClick={() => setFilter(f)}
              >
                {f}
              </Button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            Loading projects...
          </div>
        ) : visible.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
              <FolderOpen className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="font-bold text-slate-900 mb-1">
              {search || filter !== "All" ? "No matching projects" : "No projects yet"}
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              {search || filter !== "All"
                ? "Try a different search or filter."
                : "Create your first project to get started."}
            </p>
            {!search && filter === "All" && (
              <Link to="/project/new">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
                  <Plus className="w-4 h-4" /> New Project
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {visible.map((project) => (
              <Link key={project.id} to={`/project/${project.id}`}>
                <Card className="border-none shadow-sm hover:shadow-md transition-all group">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex items-center gap-4 min-w-[250px]">
                        <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold text-lg">
                          {project.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                            {project.name}
                          </h3>
                          <p className="text-sm text-slate-500">{project.client_name}</p>
                        </div>
                      </div>

                      <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
                          <Badge className={cn("border-none", STATUS_COLORS[project.status] ?? "bg-slate-100 text-slate-600")}>
                            {project.status}
                          </Badge>
                        </div>

                        <div className="hidden sm:block">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Progress</p>
                          <div className="flex items-center gap-3">
                            <Progress value={project.progress} className="h-1.5 w-24 bg-slate-100" />
                            <span className="text-xs font-bold text-slate-700">{project.progress}%</span>
                          </div>
                        </div>

                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Due Date</p>
                          <div className="flex items-center gap-1.5 text-sm text-slate-600">
                            <Clock className="w-3.5 h-3.5" />
                            {project.due_date
                              ? new Date(project.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                              : "—"}
                          </div>
                        </div>

                        <div className="hidden md:block">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Health</p>
                          <div className="flex items-center gap-1.5">
                            {project.health === "Healthy" ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-rose-500" />
                            )}
                            <span className={cn(
                              "text-xs font-bold",
                              project.health === "Healthy" ? "text-emerald-600" : "text-rose-600"
                            )}>
                              {project.health}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right hidden lg:block">
                          <p className="text-xs text-slate-400 font-medium">Budget</p>
                          <p className="font-bold text-slate-900">{formatAmount(project.budget)}</p>
                        </div>
                        <Button variant="ghost" size="icon" className="text-slate-400">
                          <ArrowUpRight className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Projects;
