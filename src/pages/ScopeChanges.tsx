import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  ArrowUpRight,
  History,
  FileSignature
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const ScopeChanges = () => {
  const changeOrders = [
    {
      id: "CO-001",
      project: "Brand Identity Redesign",
      client: "Acme Corp",
      description: "Additional Social Media Assets (10 templates)",
      impact: "+$1,200",
      timeline: "+1 week",
      status: "Pending Approval",
      date: "Oct 15, 2023"
    },
    {
      id: "CO-002",
      project: "Mobile App UI Kit",
      client: "Global Tech",
      description: "Dark Mode Support for all screens",
      impact: "+$2,500",
      timeline: "+2 weeks",
      status: "Approved",
      date: "Oct 10, 2023"
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Scope Change Management</h1>
            <p className="text-slate-500">Track scope creep and manage formal change orders.</p>
          </div>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
            <Plus className="w-4 h-4" />
            Create Change Order
          </Button>
        </div>

        {/* Creep Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-none shadow-sm bg-amber-50 border-amber-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-amber-100 text-amber-700">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <Badge variant="secondary" className="bg-amber-100 text-amber-700 border-none">
                  Active Creep
                </Badge>
              </div>
              <p className="text-sm font-medium text-slate-500">Pending Value</p>
              <h3 className="text-2xl font-bold text-slate-900">$1,200.00</h3>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm bg-emerald-50 border-emerald-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 border-none">
                  Approved Value
                </Badge>
              </div>
              <p className="text-sm font-medium text-slate-500">Total Recovered</p>
              <h3 className="text-2xl font-bold text-slate-900">$8,450.00</h3>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm bg-indigo-50 border-indigo-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-indigo-100 text-indigo-700">
                  <History className="w-5 h-5" />
                </div>
                <Badge variant="secondary" className="bg-indigo-100 text-indigo-700 border-none">
                  Timeline Impact
                </Badge>
              </div>
              <p className="text-sm font-medium text-slate-500">Total Extension</p>
              <h3 className="text-2xl font-bold text-slate-900">+24 Days</h3>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Recent Change Orders</h2>
          {changeOrders.map((co) => (
            <Card key={co.id} className="border-none shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                      co.status === "Approved" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                    )}>
                      <FileSignature className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-bold text-slate-900">{co.description}</h4>
                        <Badge className={cn(
                          "border-none",
                          co.status === "Approved" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                        )}>
                          {co.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-500">{co.project} • {co.client}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Impact</p>
                      <p className="font-bold text-slate-900">{co.impact}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Timeline</p>
                      <p className="font-bold text-slate-900">{co.timeline}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="text-slate-400">
                      <ArrowUpRight className="w-5 h-5" />
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

export default ScopeChanges;