import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import TaskBoard from "@/components/projects/TaskBoard";
import { 
  ChevronLeft, 
  Plus, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  FileText,
  MoreHorizontal,
  ArrowUpRight,
  History,
  MessageSquare
} from "lucide-react";
import { cn } from "@/lib/utils";

const ProjectDetails = () => {
  const { projectId } = useParams();

  const project = {
    name: "Brand Identity Redesign",
    client: "Acme Corp",
    status: "In Progress",
    progress: 65,
    budget: "$5,000",
    spent: "$3,250",
    scopeCreep: "+$1,200",
    milestones: [
      { id: 1, title: "Discovery Phase", status: "Approved", date: "Oct 12" },
      { id: 2, title: "Initial Concepts", status: "Under Review", date: "Oct 28" },
      { id: 3, title: "Final Assets", status: "Not Started", date: "Nov 15" },
    ],
    changeOrders: [
      { id: "CO-01", title: "Social Media Kit", amount: "$800", status: "Approved", date: "Oct 20" },
      { id: "CO-02", title: "Additional Revision Round", amount: "$400", status: "Pending", date: "Oct 30" },
    ]
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Link to="/projects">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900">{project.name}</h1>
              <Badge className="bg-blue-50 text-blue-700 border-none">{project.status}</Badge>
            </div>
            <p className="text-slate-500">Client: {project.client}</p>
          </div>
          <div className="ml-auto flex gap-3">
            <Button variant="outline" className="border-slate-200">View Portal</Button>
            <Link to={`/project/${projectId}/change-order`}>
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
                <Plus className="w-4 h-4" />
                New Change Order
              </Button>
            </Link>
          </div>
        </div>

        {/* Project Health & Financials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <p className="text-sm font-medium text-slate-500 mb-1">Project Progress</p>
              <div className="flex items-end justify-between mb-2">
                <h3 className="text-2xl font-bold text-slate-900">{project.progress}%</h3>
                <span className="text-xs text-slate-400">Target: Nov 15</span>
              </div>
              <Progress value={project.progress} className="h-2 bg-slate-100" />
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <p className="text-sm font-medium text-slate-500 mb-1">Budget Utilization</p>
              <div className="flex items-end justify-between">
                <h3 className="text-2xl font-bold text-slate-900">{project.spent} / {project.budget}</h3>
                <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-none">Healthy</Badge>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm bg-amber-50 border border-amber-100">
            <CardContent className="p-6">
              <p className="text-sm font-medium text-amber-700 mb-1">Scope Creep Value</p>
              <div className="flex items-end justify-between">
                <h3 className="text-2xl font-bold text-amber-900">{project.scopeCreep}</h3>
                <div className="flex items-center gap-1 text-amber-600">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-xs font-bold">2 Change Orders</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Tasks Section */}
            <Card className="border-none shadow-sm">
              <CardContent className="p-6">
                <TaskBoard />
              </CardContent>
            </Card>

            {/* Milestones */}
            <Card className="border-none shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-bold">Milestones & Deliverables</CardTitle>
                <Button variant="ghost" size="sm" className="text-indigo-600">Add Milestone</Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {project.milestones.map((m) => (
                  <div key={m.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-indigo-100 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center",
                        m.status === "Approved" ? "bg-emerald-50 text-emerald-600" : 
                        m.status === "Under Review" ? "bg-amber-50 text-amber-600" : "bg-slate-100 text-slate-400"
                      )}>
                        {m.status === "Approved" ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{m.title}</h4>
                        <p className="text-xs text-slate-500">Due {m.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge className={cn(
                        "border-none",
                        m.status === "Approved" ? "bg-emerald-50 text-emerald-700" : 
                        m.status === "Under Review" ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-600"
                      )}>
                        {m.status}
                      </Badge>
                      <Button variant="ghost" size="icon" className="text-slate-400">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Change Order History */}
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Scope Change Audit Trail</CardTitle>
                <CardDescription>Formal record of all approved and pending scope adjustments.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {project.changeOrders.map((co) => (
                    <div key={co.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-50/50 border border-slate-100">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-slate-400 border border-slate-100">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900">{co.title}</h4>
                          <p className="text-xs text-slate-500">{co.id} • {co.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="font-bold text-slate-900">{co.amount}</p>
                          <Badge className={cn(
                            "border-none",
                            co.status === "Approved" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                          )}>
                            {co.status}
                          </Badge>
                        </div>
                        <Button variant="ghost" size="icon" className="text-slate-400">
                          <ArrowUpRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar: Activity & Communication */}
          <div className="space-y-6">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  { action: "Client approved Discovery Phase", time: "2d ago", icon: CheckCircle2, color: "text-emerald-500" },
                  { action: "New deliverable uploaded: Logo Concepts", time: "3d ago", icon: FileText, color: "text-blue-500" },
                  { action: "Change order CO-02 sent to client", time: "4d ago", icon: History, color: "text-amber-500" },
                ].map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <item.icon className={cn("w-5 h-5 shrink-0 mt-0.5", item.color)} />
                    <div>
                      <p className="text-sm text-slate-900">{item.action}</p>
                      <p className="text-xs text-slate-400">{item.time}</p>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full border-slate-200 text-slate-600">View Full History</Button>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-indigo-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare className="w-5 h-5" />
                  <h4 className="font-bold">Client Chat</h4>
                </div>
                <p className="text-indigo-100 text-sm mb-4">
                  Centralize all project communication here to avoid email threads.
                </p>
                <Link to="/messages">
                  <Button className="w-full bg-white text-indigo-600 hover:bg-indigo-50 border-none">
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