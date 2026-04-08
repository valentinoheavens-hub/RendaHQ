import React from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Plus, 
  FileText, 
  MoreVertical, 
  CheckCircle2, 
  Clock,
  ArrowUpRight,
  Send
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const Proposals = () => {
  const proposals = [
    { id: "PROP-001", title: "Website Redesign", client: "Acme Corp", status: "Accepted", date: "Oct 15", value: "$4,500" },
    { id: "PROP-002", title: "Mobile App UI", client: "Global Tech", status: "Sent", date: "Oct 28", value: "$8,200" },
    { id: "PROP-003", title: "Brand Strategy", client: "Zest Foods", status: "Draft", date: "Nov 02", value: "$2,500" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Proposals</h1>
            <p className="text-slate-500">Create and track professional quotes for your clients.</p>
          </div>
          <Link to="/proposal/new">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
              <Plus className="w-4 h-4" />
              New Proposal
            </Button>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input placeholder="Search proposals..." className="pl-10 bg-white border-slate-200" />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="border-slate-200">All</Button>
            <Button variant="ghost" className="text-slate-500">Sent</Button>
            <Button variant="ghost" className="text-slate-500">Accepted</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {proposals.map((prop) => (
            <Card key={prop.id} className="border-none shadow-sm hover:shadow-md transition-all group">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-4 min-w-[250px]">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{prop.title}</h3>
                      <p className="text-sm text-slate-500">{prop.client}</p>
                    </div>
                  </div>

                  <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-8">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
                      <Badge className={cn(
                        "border-none",
                        prop.status === "Accepted" ? "bg-emerald-50 text-emerald-700" : 
                        prop.status === "Sent" ? "bg-blue-50 text-blue-700" : "bg-slate-100 text-slate-600"
                      )}>
                        {prop.status}
                      </Badge>
                    </div>
                    
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Date</p>
                      <div className="flex items-center gap-1.5 text-sm text-slate-600">
                        <Clock className="w-3.5 h-3.5" />
                        {prop.date}
                      </div>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Value</p>
                      <p className="font-bold text-slate-900">{prop.value}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="text-slate-400">
                      <Send className="w-4 h-4" />
                    </Button>
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

export default Proposals;