"use client";

import React from "react";
import { useParams, Link } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  ChevronLeft, 
  Mail, 
  MessageSquare, 
  Target, 
  Users, 
  CheckCircle2, 
  Clock, 
  TrendingUp,
  Briefcase,
  Calendar,
  Star,
  MoreHorizontal
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const StaffDetails = () => {
  const { staffId } = useParams();

  // Mock data for a specific staff member
  const staff = {
    id: "1",
    name: "Sarah Chen",
    role: "Senior UI/UX Designer",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200",
    email: "sarah@rendahq.com",
    alignment: 92,
    engagement: 88,
    vitality: 75,
    rating: 4.9,
    clients: [
      { id: "1", name: "Acme Corp", logo: "https://api.dicebear.com/7.x/initials/svg?seed=AC" },
      { id: "4", name: "Swift Logistics", logo: "https://api.dicebear.com/7.x/initials/svg?seed=SL" }
    ],
    projects: [
      { id: "1", name: "Brand Identity Redesign", client: "Acme Corp", progress: 65, status: "In Progress" },
      { id: "5", name: "Mobile App Refresh", client: "Swift Logistics", progress: 20, status: "Onboarding" }
    ],
    tasks: [
      { id: 101, title: "Finalize color palette", project: "Brand Identity", due: "Today", priority: "High" },
      { id: 102, title: "Client feedback session", project: "Brand Identity", due: "Tomorrow", priority: "Medium" },
      { id: 103, title: "Initial wireframes", project: "Mobile App Refresh", due: "Friday", priority: "High" },
      { id: 104, title: "Update style guide", project: "Brand Identity", due: "Next Week", priority: "Low" }
    ]
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Link to="/team-optimization">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16 rounded-2xl border-2 border-white shadow-md">
              <AvatarImage src={staff.avatar} className="object-cover" />
              <AvatarFallback>{staff.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-slate-900">{staff.name}</h1>
                <Badge className="bg-emerald-50 text-emerald-700 border-none">Peak Performance</Badge>
              </div>
              <p className="text-slate-500">{staff.role}</p>
            </div>
          </div>
          <div className="ml-auto flex gap-3">
            <Button variant="outline" className="border-slate-200 gap-2">
              <Mail className="w-4 h-4" />
              Email
            </Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
              <MessageSquare className="w-4 h-4" />
              Message
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Stats & Clients */}
          <div className="space-y-6">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <span>Vision Alignment</span>
                    <span className="text-slate-900">{staff.alignment}%</span>
                  </div>
                  <Progress value={staff.alignment} className="h-1.5 bg-slate-100 [&>div]:bg-emerald-500" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <span>Engagement</span>
                    <span className="text-slate-900">{staff.engagement}%</span>
                  </div>
                  <Progress value={staff.engagement} className="h-1.5 bg-slate-100 [&>div]:bg-emerald-500" />
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                  <span className="text-sm font-medium text-slate-500">Client Rating</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-slate-900">{staff.rating}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Assigned Clients</CardTitle>
                <CardDescription>Clients managed by {staff.name.split(' ')[0]}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {staff.clients.map((client) => (
                  <Link key={client.id} to={`/client/${client.id}`} className="flex items-center justify-between p-3 rounded-xl border border-slate-50 hover:border-emerald-100 transition-colors group">
                    <div className="flex items-center gap-3">
                      <img src={client.logo} alt={client.name} className="w-8 h-8 rounded-lg" />
                      <span className="font-bold text-slate-700 group-hover:text-emerald-600">{client.name}</span>
                    </div>
                    <ChevronLeft className="w-4 h-4 text-slate-300 rotate-180" />
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Projects & Tasks */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="tasks" className="w-full">
              <TabsList className="bg-white border border-slate-200 p-1 h-12 mb-6">
                <TabsTrigger value="tasks" className="gap-2">Active Tasks</TabsTrigger>
                <TabsTrigger value="projects" className="gap-2">Projects</TabsTrigger>
                <TabsTrigger value="history" className="gap-2">History</TabsTrigger>
              </TabsList>

              <TabsContent value="tasks" className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-slate-900">Current Workload</h3>
                  <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-none">{staff.tasks.length} Tasks</Badge>
                </div>
                {staff.tasks.map((task) => (
                  <Card key={task.id} className="border-none shadow-sm hover:shadow-md transition-all">
                    <CardContent className="p-5 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center",
                          task.priority === "High" ? "bg-rose-50 text-rose-600" : "bg-slate-50 text-slate-400"
                        )}>
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900">{task.title}</h4>
                          <p className="text-xs text-slate-500">{task.project} • Due {task.due}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge className={cn(
                          "border-none text-[10px]",
                          task.priority === "High" ? "bg-rose-50 text-rose-700" : "bg-slate-100 text-slate-600"
                        )}>
                          {task.priority} Priority
                        </Badge>
                        <Button variant="ghost" size="icon" className="text-slate-400">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="projects" className="space-y-4">
                {staff.projects.map((project) => (
                  <Card key={project.id} className="border-none shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                            <Target className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900">{project.name}</h4>
                            <p className="text-sm text-slate-500">{project.client}</p>
                          </div>
                        </div>
                        <Badge className="bg-blue-50 text-blue-700 border-none">{project.status}</Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-slate-400">Project Progress</span>
                          <span className="text-slate-900">{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2 bg-slate-100" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StaffDetails;