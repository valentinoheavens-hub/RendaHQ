import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Play, 
  Square, 
  Clock, 
  Calendar, 
  ChevronLeft, 
  ChevronRight,
  Plus,
  FileDown
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const TimeTracking = () => {
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let interval: any;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTime = (s: number) => {
    const hrs = Math.floor(s / 3600);
    const mins = Math.floor((s % 3600) / 60);
    const secs = s % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const timeLogs = [
    { id: 1, project: "Brand Identity", client: "Acme Corp", date: "Today", duration: "04:20:00", description: "Initial logo sketches and moodboarding" },
    { id: 2, project: "Mobile App UI", client: "Global Tech", date: "Yesterday", duration: "02:15:00", description: "User flow mapping for checkout process" },
    { id: 3, project: "Brand Identity", client: "Acme Corp", date: "Oct 28", duration: "03:45:00", description: "Client feedback implementation" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Time Tracking</h1>
            <p className="text-slate-500">Log your hours and bill clients accurately.</p>
          </div>
          <Button variant="outline" className="border-slate-200 gap-2">
            <FileDown className="w-4 h-4" />
            Export Timesheet
          </Button>
        </div>

        {/* Active Timer Bar */}
        <Card className="border-none shadow-lg bg-slate-900 text-white overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1 w-full">
                <Input 
                  placeholder="What are you working on?" 
                  className="bg-white/10 border-none text-white placeholder:text-slate-500 h-12 text-lg"
                />
              </div>
              <div className="flex items-center gap-6">
                <div className="text-3xl font-mono font-bold tracking-wider w-32 text-center">
                  {formatTime(seconds)}
                </div>
                <Button 
                  size="lg"
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className={cn(
                    "h-14 w-14 rounded-full shadow-xl transition-all",
                    isTimerRunning ? "bg-rose-500 hover:bg-rose-600" : "bg-indigo-600 hover:bg-indigo-700"
                  )}
                >
                  {isTimerRunning ? <Square className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Weekly Summary */}
          <Card className="lg:col-span-1 border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-bold">Weekly Summary</CardTitle>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8"><ChevronLeft className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8"><ChevronRight className="w-4 h-4" /></Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center py-4">
                <p className="text-4xl font-black text-slate-900">24.5h</p>
                <p className="text-sm text-slate-500 mt-1">Total this week</p>
              </div>
              <div className="space-y-4">
                {[
                  { day: "Mon", hours: 6.5, color: "bg-indigo-500" },
                  { day: "Tue", hours: 8.0, color: "bg-indigo-500" },
                  { day: "Wed", hours: 4.2, color: "bg-indigo-500" },
                  { day: "Thu", hours: 5.8, color: "bg-indigo-500" },
                  { day: "Fri", hours: 0, color: "bg-slate-100" },
                ].map((d) => (
                  <div key={d.day} className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-400 w-8">{d.day}</span>
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className={cn("h-full rounded-full", d.color)} style={{ width: `${(d.hours / 8) * 100}%` }} />
                    </div>
                    <span className="text-xs font-bold text-slate-900 w-8 text-right">{d.hours}h</span>
                  </div>
                ))}
              </div>
              <Button className="w-full bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-none">
                Generate Invoice from Hours
              </Button>
            </CardContent>
          </Card>

          {/* Recent Logs */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-slate-900">Recent Logs</h3>
              <Button variant="ghost" size="sm" className="text-indigo-600">View All</Button>
            </div>
            {timeLogs.map((log) => (
              <Card key={log.id} className="border-none shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{log.description}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 border-none text-[10px] px-1.5">
                            {log.project}
                          </Badge>
                          <span className="text-xs text-slate-400">•</span>
                          <span className="text-xs text-slate-500">{log.client}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900">{log.duration}</p>
                      <p className="text-xs text-slate-400">{log.date}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

import { cn } from "@/lib/utils";
export default TimeTracking;