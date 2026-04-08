import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Plus, 
  MoreVertical, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ArrowUpRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const Projects = () => {
  const projects = [
    { id: "1", name: "Brand Identity Redesign", client: "Acme Corp", status: "In Progress", progress: 65, health: "Healthy", dueDate: "Nov 15", budget: "$5,000" },
    { id: "2", name: "Mobile App UI Kit", client: "Global Tech", status: "Under Review", progress: 90, health: "At Risk", dueDate: "Oct 30", budget: "$8,500" },
    { id: "3", name: "Q4 Marketing Strategy", client: "Zest Foods", status: "Completed", progress: 100, health: "Healthy", dueDate: "Oct 20", budget: "$3,200" },
    { id: "4", name: "E-commerce Website", client: "Acme Corp", status: "Onboarding", progress: 10, health: "Healthy", dueDate: "Dec 20", budget: "$12,000" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Projects</h1>
            <p className="text-slate-500">Manage your active work and track project health.</p>
          </div>
          <Link to="/project/new">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
              <Plus className="w-4 h-4" />
              New Project
            </Button>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input placeholder="Search projects..." className="pl-10 bg-white border-slate-200" />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="border-slate-200">All</Button>
            <Button variant="ghost" className="text-slate-500">Active</Button>
            <Button variant="ghost" className="text-slate-500">Completed</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {projects.map((project) => (
            <Link key={project.id} to={`/project/${project.id}`}>
              <Card className="border-none shadow-sm hover:shadow-md transition-all group">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4 min-w-[250px]">
                      <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-lg">
                        {project.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{project.name}</h3>
                        <p className="text-sm text-slate-500">{project.client}</p>
                      </div>
                    </div>

                    <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-8">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
                        <Badge className={cn(
                          "border-none",
                          project.status === "In Progress" ? "bg-blue-50 text-blue-700" : 
                          project.status === "Completed" ? "bg-emerald-50 text-emerald-700" : 
                          project.status === "Under Review" ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-600"
                        )}>
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
                          {project.dueDate}
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
                          )}>{project.health}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right hidden lg:block">
                        <p className="text-xs text-slate-400 font-medium">Budget</p>
                        <p className="font-bold text-slate-900">{project.budget}</p>
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
      </div>
    </DashboardLayout>
  );
};

export default Projects;