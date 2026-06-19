"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Search,
  Plus,
  Mail,
  ExternalLink,
  MoreHorizontal,
  UserPlus,
  Loader2,
  Phone,
  Building2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { showSuccess, showError } from "@/utils/toast";
import { clientStore, Client } from "@/lib/clientStore";

const Clients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    status: "Active" as Client["status"],
    notes: "",
  });

  const loadClients = () => {
    clientStore.getAll()
      .then(setClients)
      .catch(() => setClients([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadClients();
  }, []);

  const filtered = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.email ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.company ?? "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSave = async () => {
    if (!form.name.trim()) { showError("Client name is required."); return; }
    setSaving(true);
    try {
      await clientStore.create(form);
      showSuccess("Client added!");
      setShowDialog(false);
      setForm({ name: "", email: "", phone: "", company: "", status: "Active", notes: "" });
      loadClients();
    } catch (e: any) {
      showError(e.message || "Failed to add client.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Clients</h1>
            <p className="text-slate-500">Manage your client relationships.</p>
          </div>
          <Button
            className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
            onClick={() => setShowDialog(true)}
          >
            <UserPlus className="w-4 h-4" />
            Add New Client
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search by name, email or company..."
              className="pl-10 bg-white border-slate-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((client) => (
              <Card key={client.id} className="border-none shadow-sm hover:shadow-md transition-all">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <Avatar className="w-12 h-12 rounded-xl">
                      <AvatarFallback className="rounded-xl bg-emerald-100 text-emerald-700 font-bold text-lg">
                        {client.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <Badge className={cn(
                      "border-none",
                      client.status === "Active" ? "bg-emerald-50 text-emerald-700" :
                      client.status === "Onboarding" ? "bg-amber-50 text-amber-700" :
                      "bg-slate-100 text-slate-600"
                    )}>
                      {client.status}
                    </Badge>
                  </div>

                  <div className="space-y-1 mb-6">
                    <Link to={`/client/${client.id}`} className="hover:text-emerald-600 transition-colors">
                      <h3 className="font-bold text-lg text-slate-900">{client.name}</h3>
                    </Link>
                    {client.company && (
                      <p className="text-sm text-slate-500 flex items-center gap-1">
                        <Building2 className="w-3 h-3" /> {client.company}
                      </p>
                    )}
                    {client.email && (
                      <p className="text-sm text-slate-500 flex items-center gap-1">
                        <Mail className="w-3 h-3" /> {client.email}
                      </p>
                    )}
                    {client.phone && (
                      <p className="text-sm text-slate-500 flex items-center gap-1">
                        <Phone className="w-3 h-3" /> {client.phone}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Link to={`/client/${client.id}`} className="flex-1">
                      <Button variant="secondary" className="w-full bg-slate-50 text-slate-600 hover:bg-slate-100">
                        View Details
                      </Button>
                    </Link>
                    <Link to={`/portal/${client.id}`}>
                      <Button variant="outline" size="icon" className="border-slate-200 text-slate-600">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button variant="ghost" size="icon" className="text-slate-400">
                      <MoreHorizontal className="w-5 h-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            <button
              onClick={() => setShowDialog(true)}
              className="border-2 border-dashed border-slate-200 rounded-3xl p-6 flex flex-col items-center justify-center text-slate-400 hover:border-emerald-300 hover:text-emerald-500 transition-all min-h-[220px]"
            >
              <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                <Plus className="w-6 h-6" />
              </div>
              <p className="font-bold">Add New Client</p>
              <p className="text-sm">Click to get started</p>
            </button>
          </div>
        )}

        {!loading && filtered.length === 0 && clients.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200">
            <UserPlus className="w-10 h-10 text-emerald-200 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No clients yet</p>
            <p className="text-slate-400 text-sm mt-1">Add your first client to get started.</p>
          </div>
        )}
      </div>

      {/* Add Client Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[460px] rounded-3xl border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Add New Client</DialogTitle>
            <DialogDescription>Fill in the client's details to add them to your workspace.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="c-name">Name *</Label>
              <Input id="c-name" placeholder="e.g. Acme Corp" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="c-email">Email</Label>
              <Input id="c-email" type="email" placeholder="contact@client.com" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="c-phone">Phone</Label>
                <Input id="c-phone" placeholder="+234 ..." value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="c-company">Company</Label>
                <Input id="c-company" placeholder="Company name" value={form.company} onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="c-status">Status</Label>
              <select
                id="c-status"
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as Client["status"] }))}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option>Active</option>
                <option>Onboarding</option>
                <option>Inactive</option>
              </select>
            </div>
            <div className="flex gap-3 pt-1">
              <Button variant="outline" className="flex-1" onClick={() => setShowDialog(false)}>Cancel</Button>
              <Button
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {saving ? "Saving…" : "Add Client"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Clients;
