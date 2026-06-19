import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  CheckCircle2,
  Clock,
  FileText,
  MessageSquare,
  AlertCircle,
  ThumbsUp,
  Loader2,
  XCircle,
  CreditCard,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface PortalInvoice {
  id: string;
  invoice_number: string;
  amount: number;
  status: string;
  due_date?: string | null;
  created_at: string;
}

interface PortalContract {
  id: string;
  title: string;
  status: string;
  service_type: string;
  value: string;
  created_at: string;
}

interface PortalProject {
  id: string;
  name: string;
  status: string;
  progress: number;
  due_date?: string | null;
  health: string;
  milestones: Array<{ id: string; title: string; date: string; status: string }>;
}

interface PortalData {
  client: { id: string; name: string; company?: string | null; email?: string | null };
  invoices: PortalInvoice[];
  contracts: PortalContract[];
  projects: PortalProject[];
}

const INVOICE_COLORS: Record<string, string> = {
  Paid:      "bg-emerald-50 text-emerald-700",
  Sent:      "bg-blue-50 text-blue-700",
  Overdue:   "bg-rose-50 text-rose-700",
  Draft:     "bg-slate-100 text-slate-600",
  Cancelled: "bg-slate-100 text-slate-400",
};

const CONTRACT_COLORS: Record<string, string> = {
  Signed:    "bg-emerald-50 text-emerald-700",
  Sent:      "bg-blue-50 text-blue-700",
  Draft:     "bg-slate-100 text-slate-600",
  Cancelled: "bg-slate-100 text-slate-400",
};

const fmt = (amount: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

const ClientPortal = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const [data, setData] = useState<PortalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [approvedFiles, setApprovedFiles] = useState<Set<string>>(new Set());

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

  useEffect(() => {
    if (!clientId) return;
    const endpoint = `${supabaseUrl}/functions/v1/client-portal?clientId=${clientId}`;
    fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${supabaseKey}`,
        apikey: supabaseKey,
      },
    })
      .then((res) => {
        if (!res.ok) return res.json().then((e) => Promise.reject(e.error ?? "Not found"));
        return res.json();
      })
      .then((json: PortalData) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        setError(typeof err === "string" ? err : "Failed to load portal data.");
        setLoading(false);
      });
  }, [clientId, supabaseUrl, supabaseKey]);

  const toggleApproval = (id: string) => {
    setApprovedFiles((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-center p-8">
        <XCircle className="w-12 h-12 text-rose-400 mb-4" />
        <h2 className="text-xl font-bold text-slate-900 mb-2">Portal not found</h2>
        <p className="text-slate-500 max-w-sm">{error ?? "This portal link may be invalid or expired."}</p>
      </div>
    );
  }

  const { client, invoices, contracts, projects } = data;
  const activeProject = projects[0] ?? null;
  const pendingInvoices = invoices.filter((i) => i.status === "Sent" || i.status === "Overdue");
  const totalOwed = pendingInvoices.reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-lg">
              {client.name.charAt(0)}
            </div>
            <div>
              <h1 className="font-bold text-lg text-slate-900">Client Portal</h1>
              <p className="text-xs text-slate-500">Powered by RendaHQ</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs">
              {client.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 md:p-8 space-y-8">
        {/* Hero banner */}
        <div className="bg-emerald-600 rounded-2xl p-8 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-2">
              Welcome back, {client.name.split(" ")[0]}
            </h2>
            {activeProject ? (
              <p className="text-emerald-100 max-w-md">
                Your project <strong>"{activeProject.name}"</strong> is{" "}
                {activeProject.progress}% complete.{" "}
                {activeProject.health === "At Risk"
                  ? "We need your attention on a few items."
                  : "Things are on track!"}
              </p>
            ) : (
              <p className="text-emerald-100">Your workspace is ready.</p>
            )}
            {totalOwed > 0 && (
              <div className="mt-4 inline-flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2">
                <AlertCircle className="w-4 h-4 text-amber-300" />
                <span className="text-sm font-medium">
                  {fmt(totalOwed)} outstanding — {pendingInvoices.length} invoice{pendingInvoices.length > 1 ? "s" : ""}
                </span>
              </div>
            )}
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="projects" className="w-full">
              <TabsList className="bg-white border border-slate-200 p-1 h-12">
                <TabsTrigger value="projects" className="data-[state=active]:bg-slate-100">
                  Projects {projects.length > 0 && `(${projects.length})`}
                </TabsTrigger>
                <TabsTrigger value="invoices" className="data-[state=active]:bg-slate-100">
                  Invoices {invoices.length > 0 && `(${invoices.length})`}
                </TabsTrigger>
                <TabsTrigger value="contracts" className="data-[state=active]:bg-slate-100">
                  Contracts {contracts.length > 0 && `(${contracts.length})`}
                </TabsTrigger>
              </TabsList>

              {/* Projects tab */}
              <TabsContent value="projects" className="mt-6 space-y-4">
                {projects.length === 0 ? (
                  <EmptyState icon={FileText} text="No projects assigned yet." />
                ) : (
                  projects.map((p) => (
                    <Card key={p.id} className="border-none shadow-sm">
                      <CardContent className="p-6 space-y-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-bold text-slate-900">{p.name}</h4>
                            {p.due_date && (
                              <p className="text-xs text-slate-500 mt-0.5">
                                Due {fmtDate(p.due_date)}
                              </p>
                            )}
                          </div>
                          <Badge className={cn("border-none", p.health === "Healthy" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700")}>
                            {p.health}
                          </Badge>
                        </div>

                        <div>
                          <div className="flex justify-between text-xs text-slate-500 mb-1">
                            <span>Progress</span>
                            <span className="font-bold text-slate-700">{p.progress}%</span>
                          </div>
                          <Progress value={p.progress} className="h-2 bg-slate-100" />
                        </div>

                        {p.milestones.length > 0 && (
                          <div className="space-y-2">
                            {p.milestones.map((m) => (
                              <div key={m.id} className="flex items-center gap-3">
                                <div className={cn(
                                  "w-6 h-6 rounded-full flex items-center justify-center shrink-0",
                                  m.status === "Approved" || m.status === "Done"
                                    ? "bg-emerald-50 text-emerald-600"
                                    : m.status === "Under Review"
                                    ? "bg-amber-50 text-amber-600"
                                    : "bg-slate-100 text-slate-400"
                                )}>
                                  {m.status === "Approved" || m.status === "Done"
                                    ? <CheckCircle2 className="w-4 h-4" />
                                    : <Clock className="w-4 h-4" />}
                                </div>
                                <div className="flex-1 flex items-center justify-between">
                                  <span className="text-sm text-slate-700">{m.title}</span>
                                  <Badge variant="secondary" className={cn(
                                    "border-none text-[10px]",
                                    m.status === "Approved" || m.status === "Done"
                                      ? "bg-emerald-50 text-emerald-700"
                                      : m.status === "Under Review"
                                      ? "bg-amber-50 text-amber-700"
                                      : "bg-slate-100 text-slate-600"
                                  )}>
                                    {m.status}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>

              {/* Invoices tab */}
              <TabsContent value="invoices" className="mt-6 space-y-4">
                {invoices.length === 0 ? (
                  <EmptyState icon={CreditCard} text="No invoices yet." />
                ) : (
                  invoices.map((inv) => (
                    <Card key={inv.id} className="border-none shadow-sm">
                      <div className="p-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                            <FileText className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900">{inv.invoice_number}</h4>
                            <p className="text-sm text-slate-500">
                              {fmtDate(inv.created_at)}
                              {inv.due_date && ` • Due ${fmtDate(inv.due_date)}`}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-slate-900">{fmt(inv.amount)}</p>
                          <Badge className={cn("border-none", INVOICE_COLORS[inv.status] ?? "bg-slate-100 text-slate-600")}>
                            {inv.status}
                          </Badge>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </TabsContent>

              {/* Contracts tab */}
              <TabsContent value="contracts" className="mt-6 space-y-4">
                {contracts.length === 0 ? (
                  <EmptyState icon={FileText} text="No contracts yet." />
                ) : (
                  contracts.map((c) => (
                    <Card key={c.id} className="border-none shadow-sm">
                      <div className="p-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                            <FileText className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900">{c.title}</h4>
                            <p className="text-sm text-slate-500">
                              {c.service_type} • {fmtDate(c.created_at)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-slate-900">{c.value}</p>
                          <Badge className={cn("border-none", CONTRACT_COLORS[c.status] ?? "bg-slate-100 text-slate-600")}>
                            {c.status}
                          </Badge>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Your Account</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Name</span>
                  <span className="font-medium text-slate-900">{client.name}</span>
                </div>
                {client.company && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Company</span>
                    <span className="font-medium text-slate-900">{client.company}</span>
                  </div>
                )}
                {client.email && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Email</span>
                    <span className="font-medium text-slate-900 truncate max-w-[160px]">{client.email}</span>
                  </div>
                )}
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Projects</span>
                    <span className="font-bold text-slate-900">{projects.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Invoices</span>
                    <span className="font-bold text-slate-900">{invoices.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Contracts</span>
                    <span className="font-bold text-slate-900">{contracts.length}</span>
                  </div>
                  {totalOwed > 0 && (
                    <div className="flex justify-between text-rose-600">
                      <span className="font-medium">Outstanding</span>
                      <span className="font-bold">{fmt(totalOwed)}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-slate-900 text-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare className="w-5 h-5" />
                  <h4 className="font-bold">Need help?</h4>
                </div>
                <p className="text-slate-400 text-sm mb-4">
                  Message your project manager directly through the portal.
                </p>
                <Button className="w-full bg-white text-slate-900 hover:bg-slate-100 border-none">
                  Open Chat
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

const EmptyState = ({ icon: Icon, text }: { icon: React.ElementType; text: string }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center text-slate-400">
    <Icon className="w-8 h-8 mb-3 opacity-40" />
    <p className="text-sm">{text}</p>
  </div>
);

export default ClientPortal;
