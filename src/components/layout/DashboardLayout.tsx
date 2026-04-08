import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  CreditCard, 
  Clock, 
  Settings, 
  Bell,
  Search,
  Plus,
  Briefcase,
  ShieldAlert
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  
  const navigation = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Projects", href: "/projects", icon: Briefcase },
    { name: "Scope Changes", href: "/scope", icon: ShieldAlert },
    { name: "Contracts", href: "/contracts", icon: FileText },
    { name: "Invoices", href: "/invoices", icon: CreditCard },
    { name: "Time Tracking", href: "/time", icon: Clock },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col sticky top-0 h-screen">
        <div className="p-6">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">N</span>
            </div>
            <span className="font-bold text-xl tracking-tight">NexWork</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-indigo-50 text-indigo-700" 
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive ? "text-indigo-600" : "text-slate-400")} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="bg-indigo-600 rounded-xl p-4 text-white">
            <p className="text-xs font-medium opacity-80 mb-1">Freelancer Plan</p>
            <p className="text-sm font-bold mb-3">2/3 Clients Used</p>
            <Button variant="secondary" size="sm" className="w-full bg-white/10 hover:bg-white/20 border-none text-white">
              Upgrade Plan
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center gap-4 flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Search clients, projects..." 
                className="pl-10 bg-slate-50 border-none focus-visible:ring-1 focus-visible:ring-indigo-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" className="hidden md:flex items-center gap-2">
              <Plus className="w-4 h-4" />
              New Project
            </Button>
            <button className="p-2 text-slate-400 hover:text-slate-600 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 overflow-hidden">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Avatar" />
            </div>
          </div>
        </header>

        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;