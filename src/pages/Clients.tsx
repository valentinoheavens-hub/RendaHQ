import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Plus, 
  Mail, 
  ExternalLink, 
  MoreHorizontal,
  UserPlus,
  CheckCircle2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Clients = () => {
  const clients = [
    { 
      id: "1", 
      name: "Acme Corp", 
      contact: "John Doe", 
      email: "john@acme.com", 
      status: "Active", 
      projects: 2, 
      revenue: "$12,500",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=AC"
    },
    { 
      id: "2", 
      name: "Global Tech", 
      contact: "Sarah Smith", 
      email: "sarah@global.io", 
      status: "Onboarding", 
      projects: 1, 
      revenue: "$8,200",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=GT"
    },
    { 
      id: "3", 
      name: "Zest Foods", 
      contact: "Mike Ross", 
      email: "mike@zest.com", 
      status: "Active", 
      projects: 1, 
      revenue: "$4,000",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=ZF"
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Clients</h1>
            <p className="text-slate-500">Manage your client relationships and portal access.</p>
          </div>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
            <UserPlus className="w-4 h-4" />
            Add New Client
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input placeholder="Search by name, email or company..." className="pl-10 bg-white border-slate-200" />
          </div>
          <Button variant="outline" className="border-slate-200">Filter</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clients.map((client) => (
            <Card key={client.id} className="border-none shadow-sm hover:shadow-md transition-all group">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <Avatar className="w-12 h-12 rounded-xl">
                    <AvatarImage src={client.avatar} />
                    <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <Badge className={cn(
                    "border-none",
                    client.status === "Active" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                  )}>
                    {client.status}
                  </Badge>
                </div>
                
                <div className="space-y-1 mb-6">
                  <h3 className="font-bold text-lg text-slate-900">{client.name}</h3>
                  <p className="text-sm text-slate-500 flex items-center gap-1">
                    <Mail className="w-3 h-3" /> {client.email}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-50 mb-6">
                  <div>
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Projects</p>
                    <p className="font-bold text-slate-900">{client.projects}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Revenue</p>
                    <p className="font-bold text-slate-900">{client.revenue}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" className="flex-1 border-slate-200 text-slate-600 gap-2">
                    <ExternalLink className="w-4 h-4" />
                    Portal
                  </Button>
                  <Button variant="ghost" size="icon" className="text-slate-400">
                    <MoreHorizontal className="w-5 h-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {/* Add Client Placeholder */}
          <button className="border-2 border-dashed border-slate-200 rounded-3xl p-6 flex flex-col items-center justify-center text-slate-400 hover:border-indigo-300 hover:text-indigo-500 transition-all min-h-[280px]">
            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-4 group-hover:bg-indigo-50">
              <Plus className="w-6 h-6" />
            </div>
            <p className="font-bold">Add New Client</p>
            <p className="text-sm">Send onboarding invite</p>
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

import { cn } from "@/lib/utils";
export default Clients;