import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Play, 
  Square, 
  Clock, 
  Calendar, 
  Download,
  Plus,
  MoreVertical
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const TimeTracking = () => {
  const [isTracking, setIsTracking] = useState(false);
  const [time, setTime] = useState("00:00:00");

  const logs = [
    { id: 1, project: "Brand Identity Redesign", task: "Initial Concept Sketches", duration: "04:20:00", date: "Today", billable: true },
    { id: 2, project: "Mobile App UI Kit", task: "User Flow Mapping", duration: "02:15:00", date: "Yesterday", billable: true },
    { id: 3, project: "Internal", task: "Admin & Email", duration: "01:00:00", date: "Yesterday", billable: false },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Time Tracking</h1>
            <p className="text-slate-500">Log hours and generate timesheets for billing.</p>
          </div>
          <Button variant="outline" className="border-slate-200 gap-2">
            <Download className="w-4 h-4" />
            Export PDF
          </Button>
        </div>

        {/* Active Timer */}
        <Card className={cn(
          "border-none shadow-lg transition-all duration-500",
          isTracking ? "bg-indigo-600 text-white ring-4 ring-indigo-100" : "bg-white"
        )}>
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex-1 w-full">
                <p className={cn("text-xs font-bold uppercase tracking-wider mb-2", isTracking ? "text-indigo-200" : "text-slate-400")}>
                  What are you working on?
                </p>
                <Input 
                  placeholder="Task description..." 
                  className={cn(
                    "text-xl font-bold border-none bg-transparent p-0 focus-visible:ring-0 placeholder:text-slate-300",
                    isTracking ? "text-white placeholder:text-indigo-300" : "text-slate-900"
                  )}
                />
                <div className="flex items-center gap-4 mt-4">
                  <select className={cn(
                    "bg-transparent border-none text-sm font-medium focus:ring-0",
                    isTracking ? "text-indigo-100" : "text-slate-500"
                  )}>
                    <option>Select Project</option>
                    <option>Brand Identity Redesign</option>
                    <option>Mobile App UI Kit</option>
                  </select>
                  <Badge className={cn(
                    "border-none",
                    isTracking ? "bg-white/10 text-white" : "bg-slate-100 text-slate-600"
                  )}>
                    Billable
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div className="text-center">
                  <p className={cn("text-xs font-bold uppercase tracking-wider mb-1", isTracking ? "text-indigo-200" : "text-slate-400")}>
                    Duration
                  </p>
                  <h2 className="text-5xl font-black tracking-tighter tabular-nums">
                    {time}
                  </h2>
                </div>
                <Button 
                  size="lg" 
                  onClick={() => setIsTracking(!isTracking)}
                  className={cn(
                    "w-16 h-16 rounded-full shadow-xl transition-transform active:scale-95",
                    isTracking ? "bg-white text-indigo-600 hover:bg-slate-50" : "bg-indigo-600 text-white hover:bg-indigo-700"
                  )}
                >
                  {isTracking ? <Square className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Logs */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Recent Logs</h2>
            <Button variant="ghost" size="sm" className="text-indigo-600 gap-2">
              <Plus className="w-4 h-4" />
              Manual Entry
            </Button>
          </div>
          
          {logs.map((log) => (
            <Card key={log.id} className="border-none shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{log.task}</h4>
                      <p className="text-sm text-slate-500">{log.project} • {log.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <p className="font-bold text-slate-900 tabular-nums">{log.duration}</p>
                      <Badge className={cn(
                        "border-none",
                        log.billable ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"
                      )}>
                        {log.billable ? "Billable" : "Non-billable"}
                      </Badge>
                    </div>
                    <Button variant="ghost" size="icon" className="text-slate-400">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TimeTracking;