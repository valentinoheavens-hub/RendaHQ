"use client";

import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Calendar as CalendarIcon,
  Clock,
  MoreVertical,
  Target
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const Calendar = () => {
  const days = Array.from({ length: 35 }, (_, i) => i - 3); // Mock days for a month view
  const events = [
    { day: 12, title: "Discovery Phase Due", project: "Acme Corp", type: "deadline" },
    { day: 15, title: "Client Call", project: "Global Tech", type: "meeting" },
    { day: 28, title: "Initial Concepts", project: "Acme Corp", type: "milestone" },
    { day: 30, title: "Invoice Due", project: "Zest Foods", type: "payment" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Calendar</h1>
            <p className="text-slate-500">Track your project timelines and upcoming deadlines.</p>
          </div>
          <div className="flex gap-3">
            <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1">
              <Button variant="ghost" size="sm" className="rounded-lg">Month</Button>
              <Button variant="ghost" size="sm" className="rounded-lg text-slate-400">Week</Button>
              <Button variant="ghost" size="sm" className="rounded-lg text-slate-400">Day</Button>
            </div>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
              <Plus className="w-4 h-4" />
              Add Event
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Calendar Grid */}
          <Card className="lg:col-span-3 border-none shadow-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 bg-white p-6">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-bold text-slate-900">October 2023</h2>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8"><ChevronLeft className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8"><ChevronRight className="w-4 h-4" /></Button>
                </div>
              </div>
              <Button variant="outline" size="sm" className="border-slate-200">Today</Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-7 border-b border-slate-100">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="py-3 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7">
                {days.map((d, i) => {
                  const dayEvents = events.filter(e => e.day === d);
                  const isToday = d === 28;
                  const isCurrentMonth = d > 0 && d <= 31;

                  return (
                    <div 
                      key={i} 
                      className={cn(
                        "min-h-[120px] p-2 border-r border-b border-slate-50 transition-colors hover:bg-slate-50/50",
                        !isCurrentMonth && "bg-slate-50/30 opacity-40"
                      )}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className={cn(
                          "text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full",
                          isToday ? "bg-indigo-600 text-white" : "text-slate-600"
                        )}>
                          {d > 0 && d <= 31 ? d : d <= 0 ? 30 + d : d - 31}
                        </span>
                      </div>
                      <div className="space-y-1">
                        {dayEvents.map((event, idx) => (
                          <div 
                            key={idx} 
                            className={cn(
                              "text-[10px] p-1.5 rounded-md font-bold truncate",
                              event.type === "deadline" ? "bg-rose-50 text-rose-700 border-l-2 border-rose-500" :
                              event.type === "meeting" ? "bg-blue-50 text-blue-700 border-l-2 border-blue-500" :
                              "bg-emerald-50 text-emerald-700 border-l-2 border-emerald-500"
                            )}
                          >
                            {event.title}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Sidebar */}
          <div className="space-y-6">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Upcoming</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  { title: "Discovery Phase Due", project: "Acme Corp", time: "Tomorrow, 5:00 PM", icon: Target, color: "text-rose-500", bg: "bg-rose-50" },
                  { title: "Client Call", project: "Global Tech", time: "Oct 15, 10:00 AM", icon: Clock, color: "text-blue-500", bg: "bg-blue-50" },
                  { title: "Initial Concepts", project: "Acme Corp", time: "Oct 28, 9:00 AM", icon: CalendarIcon, color: "text-emerald-500", bg: "bg-emerald-50" },
                ].map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", item.bg, item.color)}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{item.title}</p>
                      <p className="text-xs text-slate-500">{item.project}</p>
                      <p className="text-[10px] text-slate-400 mt-1">{item.time}</p>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full border-slate-200 text-slate-600">View All Events</Button>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-slate-900 text-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CalendarIcon className="w-5 h-5 text-indigo-400" />
                  <h4 className="font-bold">Sync Calendar</h4>
                </div>
                <p className="text-slate-400 text-sm mb-4">
                  Connect your Google or Outlook calendar to sync all your project deadlines.
                </p>
                <Button className="w-full bg-white text-slate-900 hover:bg-slate-100 border-none">
                  Connect Calendar
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Calendar;