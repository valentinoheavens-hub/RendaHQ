"use client";

import React, { useState } from "react";
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
  BarChart3,
  MessageSquare,
  HelpCircle,
  LogOut,
  Target,
  FileSignature,
  Package,
  Receipt,
  FolderOpen,
  Calendar as CalendarIcon,
  Activity,
  Briefcase,
  Beaker,
  Compass,
  Globe,
  Zap,
  HeartPulse,
  Layers,
  Wallet,
  Bot,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AIAssistant } from "@/components/AIAssistant";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  
  const navigation = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Diagnostics", href: "/diagnostics", icon: Activity },
    { name: "Strategy", href: "/strategy", icon: Compass },
    { name: "Team Vitality", href: "/team-optimization", icon: HeartPulse },
    { name: "Market Intel", href: "/market", icon: Globe },
    { name: "Growth Lab", href: "/growth", icon: Beaker },
    { name: "Workflows", href: "/workflows", icon: Zap },
    { name: "Leads", href: "/leads", icon: Briefcase },
    { name: "Clients", href: "/clients", icon: Users },
    { name: "Projects", href: "/projects", icon: Target },
    { name: "Templates", href: "/project-templates", icon: Layers },
    { name: "Calendar", href: "/calendar", icon: CalendarIcon },
    { name: "Files", href: "/files", icon: FolderOpen },
    { name: "Services", href: "/services", icon: Package },
    { name: "Proposals", href: "/proposals", icon: FileSignature },
    { name: "Contracts", href: "/contracts", icon: FileText },
    { name: "Invoices", href: "/invoices", icon: CreditCard },
    { name: "Payments", href: "/payments", icon: Wallet },
    { name: "Automations", href: "/automations", icon: Bot },
    { name: "Expenses", href: "/expenses", icon: Receipt },
    { name: "Messages", href: "/messages", icon: MessageSquare },
    { name: "Time Tracking", href: "/time", icon: Clock },
    { name: "Reports", href: "/reports", icon: BarChart3 },
  ];

  const secondaryNav = [
    { name: "Help Center", href: "/help", icon: HelpCircle },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col sticky top-0 h-screen z-20">
        <div className="p-6">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">N</span>
            </div>
            <span className="font-bold text-xl tracking-tight">NexWork</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          <div className="mb-4">
            <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Main Menu</p>
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all",
                    isActive 
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-slate-400")} />
                  {item.name}
                </Link>
              );
            })}
          </div>

          <div>
            <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Support</p>
            {secondaryNav.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all",
                    isActive 
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-slate-400")} />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="bg-slate-900 rounded-2xl p-4 text-white relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-[10px] font-bold opacity-60 uppercase tracking-wider mb-1">Freelancer Plan</p>
              <p className="text-sm font-bold mb-3">2/3 Clients Used</p>
              <Button variant="secondary" size="sm" className="w-full bg-white/10 hover:bg-white/20 border-none text-white text-xs">
                Upgrade to Agency
              </Button>
            </div>
            <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-indigo-600/20 rounded-full blur-2xl" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center gap-4 flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Search clients, projects, invoices..." 
                className="pl-10 bg-slate-50 border-none focus-visible:ring-1 focus-visible:ring-indigo-500 h-9"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/project/new">
              <Button size="sm" className="hidden md:flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white">
                <Plus className="w-4 h-4" />
                New Project
              </Button>
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2 text-slate-400 hover:text-slate-600 relative rounded-full hover:bg-slate-50 transition-colors">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 p-0 border-none shadow-2xl rounded-2xl overflow-hidden">
                <div className="p-4 bg-indigo-600 text-white">
                  <h4 className="font-bold">Notifications</h4>
                  <p className="text-xs text-indigo-100">You have 3 unread alerts</p>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {[
                    { title: "Contract Signed", desc: "Sarah Chen signed the Brand Identity Agreement", time: "2m ago", icon: FileText, color: "text-emerald-500", bg: "bg-emerald-50" },
                    { title: "Payment Received", desc: "Acme Corp paid Invoice #INV-001", time: "1h ago", icon: CreditCard, color: "text-blue-500", bg: "bg-blue-50" },
                    { title: "New Message", desc: "Elena Moss sent you a message", time: "3h ago", icon: MessageSquare, color: "text-indigo-500", bg: "bg-indigo-50" },
                  ].map((n, i) => (
                    <div key={i} className="p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3">
                      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", n.bg, n.color)}>
                        <n.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{n.title}</p>
                        <p className="text-xs text-slate-500 line-clamp-1">{n.desc}</p>
                        <p className="text-[10px] text-slate-400 mt-1">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 text-center border-t border-slate-50">
                  <Button variant="ghost" size="sm" className="text-indigo-600 text-xs font-bold">View All Notifications</Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200 overflow-hidden">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Avatar" />
                  </div>
                  <div className="text-left hidden sm:block">
                    <p className="text-xs font-bold text-slate-900">Felix K.</p>
                    <p className="text-[10px] text-slate-500">Pro Plan</p>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-2 border-none shadow-2xl rounded-2xl">
                <DropdownMenuLabel className="text-xs font-bold text-slate-400 uppercase tracking-widest p-2">My Account</DropdownMenuLabel>
                <DropdownMenuItem className="rounded-xl cursor-pointer gap-2">
                  <Users className="w-4 h-4" /> Profile Settings
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-xl cursor-pointer gap-2">
                  <CreditCard className="w-4 h-4" /> Billing & Subscription
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-2 bg-slate-100" />
                <DropdownMenuItem
                  className="rounded-xl cursor-pointer gap-2 text-rose-600 focus:text-rose-600 focus:bg-rose-50"
                  onClick={() => window.location.href = '/signin'}
                >
                  <LogOut className="w-4 h-4" /> Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <div className="p-8">
          {children}
        </div>
      </main>

      {/* Global AI Assistant — available on every dashboard page */}
      <AIAssistant />
    </div>
  );
};

export default DashboardLayout;