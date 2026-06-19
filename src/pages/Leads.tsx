"use client";

import React, { useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Filter, 
  TrendingUp, 
  Users, 
  DollarSign,
  ArrowRight,
  Mail,
  Phone,
  Calendar,
  GripVertical
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const Leads = () => {
  const [view, setView] = useState<"board" | "list">("board");

  const stages = [
    { id: "discovery", name: "Discovery", color: "bg-slate-100 text-slate-700" },
    { id: "qualified", name: "Qualified", color: "bg-blue-50 text-blue-700" },
    { id: "proposal", name: "Proposal Sent", color: "bg-emerald-50 text-emerald-700" },
    { id: "negotiation", name: "Negotiation", color: "bg-amber-50 text-amber-700" },
  ];

  const leads = [
    { 
      id: 1, 
      name: "TechFlow Solutions", 
      contact: "Alex Rivera", 
      value: "$12,000", 
      stage: "discovery", 
      source: "Referral",
      lastActive: "2h ago",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=TF"
    },
    { 
      id: 2, 
      name: "GreenLeaf Eco", 
      contact: "Elena Moss", 
      value: "$8,500", 
      stage: "qualified", 
      source: "Website",
      lastActive: "1d ago",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=GL"
    },
    { 
      id: 3, 
      name: "Nova Retail", 
      contact: "Marcus Wright", 
      value: "$15,000", 
      stage: "proposal", 
      source: "LinkedIn",
      lastActive: "3h ago",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=NR"
    },
    { 
      id: 4, 
      name: "Swift Logistics", 
      contact: "Sarah Jenkins", 
      value: "$22,000", 
      stage: "negotiation", 
      source: "Cold Outreach",
      lastActive: "5h ago",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=SL"
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Sales Pipeline</h1>
            <p className="text-slate-500">Track potential deals and manage your sales funnel.</p>
          </div>
          <div className="flex gap-3">
            <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1">
              <Button 
                variant={view === "board" ? "secondary" : "ghost"} 
                size="sm" 
                onClick={() => setView("board")}
                className="rounded-lg"
              >
                Board
              </Button>
              <Button 
                variant={view === "list" ? "secondary" : "ghost"} 
                size="sm" 
                onClick={() => setView("list")}
                className="rounded-lg"
              >
                List
              </Button>
            </div>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
              <Plus className="w-4 h-4" />
              Add Lead
            </Button>
          </div>
        </div>

        {/* Pipeline Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <Badge className="bg-emerald-50 text-emerald-700 border-none">+12%</Badge>
              </div>
              <p className="text-sm font-medium text-slate-500">Pipeline Value</p>
              <h3 className="text-2xl font-bold text-slate-900">$57,500.00</h3>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <p className="text-sm font-medium text-slate-500">Active Leads</p>
              <h3 className="text-2xl font-bold text-slate-900">14</h3>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>
              <p className="text-sm font-medium text-slate-500">Avg. Deal Size</p>
              <h3 className="text-2xl font-bold text-slate-900">$4,100.00</h3>
            </CardContent>
          </Card>
        </div>

        {/* Kanban Board */}
        <div className="flex gap-6 overflow-x-auto pb-4 min-h-[600px]">
          {stages.map((stage) => (
            <div key={stage.id} className="flex-1 min-w-[300px] space-y-4">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900">{stage.name}</h3>
                  <Badge variant="secondary" className="bg-slate-100 text-slate-500 border-none">
                    {leads.filter(l => l.stage === stage.id).length}
                  </Badge>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-3">
                {leads
                  .filter((lead) => lead.stage === stage.id)
                  .map((lead) => (
                    <Link key={lead.id} to={`/lead/${lead.id}`}>
                      <Card className="border-none shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing group">
                        <CardContent className="p-4 space-y-4">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                              <Avatar className="w-8 h-8 rounded-lg">
                                <AvatarImage src={lead.avatar} />
                                <AvatarFallback>{lead.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="font-bold text-sm text-slate-900 group-hover:text-emerald-600 transition-colors">{lead.name}</h4>
                                <p className="text-[10px] text-slate-500">{lead.contact}</p>
                              </div>
                            </div>
                            <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-300 opacity-0 group-hover:opacity-100">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </div>

                          <div className="flex items-center justify-between">
                            <p className="font-bold text-slate-900">{lead.value}</p>
                            <Badge variant="outline" className="text-[10px] border-slate-100 text-slate-400">
                              {lead.source}
                            </Badge>
                          </div>

                          <div className="pt-3 border-t border-slate-50 flex items-center justify-between">
                            <div className="flex gap-1">
                              <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-emerald-600">
                                <Mail className="w-3.5 h-3.5" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-emerald-600">
                                <Phone className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                            <span className="text-[10px] text-slate-400 flex items-center gap-1">
                              <Calendar className="w-3 h-3" /> {lead.lastActive}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                
                {leads.filter(l => l.stage === stage.id).length === 0 && (
                  <div className="h-24 border-2 border-dashed border-slate-100 rounded-2xl flex items-center justify-center text-slate-300 text-sm">
                    No leads in this stage
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Leads;