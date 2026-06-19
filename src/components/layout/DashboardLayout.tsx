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
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationContext";
import { formatDistanceToNow } from "date-fns";

const notifIcon = (type: string) => {
  switch (type) {
    case 'invoice_paid':    return { icon: CreditCard,   color: 'text-emerald-500', bg: 'bg-emerald-50' };
    case 'invoice_overdue': return { icon: Clock,         color: 'text-rose-500',    bg: 'bg-rose-50' };
    case 'contract_signed': return { icon: FileText,      color: 'text-emerald-500', bg: 'bg-emerald-50' };
    case 'contract_sent':   return { icon: FileText,      color: 'text-blue-500',    bg: 'bg-blue-50' };
    case 'new_client':      return { icon: Users,         color: 'text-emerald-500',  bg: 'bg-emerald-50' };
    default:                return { icon: Bell,          color: 'text-slate-500',   bg: 'bg-slate-50' };
  }
};

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const { user, profile, signOut } = useAuth();
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications();

  const displayName = profile?.full_name?.split(' ')[0]
    ?? user?.user_metadata?.full_name?.split(' ')[0]
    ?? user?.email?.split('@')[0]
    ?? 'You';
  const agencyName = profile?.agency_name ?? 'My Agency';
  
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
          <Link to="/dashboard" className="flex items-center">
            <img src="/rendahq-logo.png" alt="RendaHQ" className="h-9 w-auto" />
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
                      ? "bg-emerald-600 text-white shadow-lg shadow-emerald-100" 
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
                      ? "bg-emerald-600 text-white shadow-lg shadow-emerald-100" 
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
            <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-emerald-600/20 rounded-full blur-2xl" />
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
                className="pl-10 bg-slate-50 border-none focus-visible:ring-1 focus-visible:ring-emerald-500 h-9"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/project/new">
              <Button size="sm" className="hidden md:flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white">
                <Plus className="w-4 h-4" />
                New Project
              </Button>
            </Link>
            
            {/* Bell — live notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2 text-slate-400 hover:text-slate-600 relative rounded-full hover:bg-slate-50 transition-colors">
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 p-0 border-none shadow-2xl rounded-2xl overflow-hidden">
                <div className="p-4 bg-emerald-600 text-white flex items-center justify-between">
                  <div>
                    <h4 className="font-bold">Notifications</h4>
                    <p className="text-xs text-emerald-100">
                      {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
                    </p>
                  </div>
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-emerald-100 hover:text-white hover:bg-white/10 text-xs h-7"
                      onClick={markAllRead}
                    >
                      Mark all read
                    </Button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="py-10 text-center text-slate-400">
                      <Bell className="w-6 h-6 mx-auto mb-2 opacity-40" />
                      <p className="text-sm">No notifications yet</p>
                    </div>
                  ) : (
                    notifications.slice(0, 10).map((n) => {
                      const { icon: Icon, color, bg } = notifIcon(n.type);
                      return (
                        <div
                          key={n.id}
                          onClick={() => !n.read && markRead(n.id)}
                          className={cn(
                            "p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3",
                            !n.read && "bg-emerald-50/40"
                          )}
                        >
                          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", bg, color)}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-bold text-slate-900">{n.title}</p>
                              {!n.read && <span className="w-2 h-2 bg-emerald-500 rounded-full shrink-0" />}
                            </div>
                            <p className="text-xs text-slate-500 line-clamp-2">{n.message}</p>
                            <p className="text-[10px] text-slate-400 mt-1">
                              {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User menu — real name + sign out */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center">
                    <span className="text-emerald-700 font-bold text-sm">
                      {displayName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="text-left hidden sm:block">
                    <p className="text-xs font-bold text-slate-900">{displayName}</p>
                    <p className="text-[10px] text-slate-500">{agencyName}</p>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-2 border-none shadow-2xl rounded-2xl">
                <DropdownMenuLabel className="text-xs font-bold text-slate-400 uppercase tracking-widest p-2">
                  My Account
                </DropdownMenuLabel>
                <DropdownMenuItem asChild className="rounded-xl cursor-pointer gap-2">
                  <a href="/settings"><Settings className="w-4 h-4" /> Settings</a>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-2 bg-slate-100" />
                <DropdownMenuItem
                  className="rounded-xl cursor-pointer gap-2 text-rose-600 focus:text-rose-600 focus:bg-rose-50"
                  onClick={() => signOut()}
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