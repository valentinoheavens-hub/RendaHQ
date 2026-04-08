import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  MoreHorizontal, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  FileUp,
  MessageSquare
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const Projects = () => {
  const projects = [
    {
      id: 1,
      name: "Brand Identity Redesign",
      client: "Acme Corp",
      progress: 65,
      status: "Active",
      health: "Healthy",
      nextMilestone: "Initial Concepts",
      dueDate: "Oct 28, 2023"
    },
    {
      id: 2,
      name: "Mobile App UI Kit",
      client: "Global Tech",
      progress: 90,
      status: "Under Review",
      health: "At Risk",
      nextMilestone: "Final Handoff",
      dueDate: "Oct 20, 2023"
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Projects</h1>
            <p className="text-slate-500">Manage your active engagements and deliverables.</p>
          </div>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
            <Plus className="w-4 h-4" />
            New Project
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="border-none shadow-sm overflow-hidden group">
              <div className="flex flex-col md:flex-row">
                <div className="p-6 flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-xl font-bold text-slate-900">{project.name}</h3>
                        <Badge className={cn(
                          "border-none",
                          project.health === "Healthy" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                        )}>
                          {project.health}
                        </Badge>
                      </div>
                      <p className="text-slate-500 font-medium">{project.client}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="text-slate-400">
                      <MoreHorizontal className="w-5 h-5" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Progress</p>
                      <div className="flex items-center gap-3">
                        <Progress value={project.progress} className="h-2 flex-1 bg-slate-100" />
                        <span className="text-sm font-bold text-slate-900">{project.progress}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Next Milestone</p>
                      <div className="flex items-center gap-2 text-slate-900 font-medium">
                        <Clock className="w-4 h-4 text-indigo-600" />
                        {project.nextMilestone}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Due Date</p>
                      <div className="flex items-center gap-2 text-slate-900 font-medium">
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                        {project.dueDate}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-6 border-t md:border-t-0 md:border-l border-slate-100 flex flex-col justify-center gap-3 w-full md:w-64">
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
                    <FileUp className="w-4 h-4" />
                    Upload Deliverable
                  </Button>
                  <Button variant="outline" className="w-full border-slate-200 text-slate-600 gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Open Chat
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Projects;