import React, { useEffect, useMemo, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Cell,
} from "recharts";
import {
  TrendingUp,
  DollarSign,
  PieChart,
  ArrowUpRight,
  Download,
  AlertCircle,
  Wallet,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCurrency } from "@/hooks/useCurrency";
import { invoiceStore, Invoice } from "@/lib/invoiceStore";
import { projectStore, Project } from "@/lib/projectStore";
import { usePlan } from "@/context/SubscriptionContext";
import UpgradeBanner from "@/components/UpgradeBanner";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const Reports = () => {
  const { format } = useCurrency();
  const { can, isFree } = usePlan();
  const canReports = can.advancedReports;

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [inv, proj] = await Promise.all([
          invoiceStore.getAll().catch(() => [] as Invoice[]),
          projectStore.getAll().catch(() => [] as Project[]),
        ]);
        if (!active) return;
        setInvoices(inv);
        setProjects(proj);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const stats = useMemo(() => {
    const paid = invoices.filter((i) => i.status === "Paid");
    const outstanding = invoices.filter((i) => i.status === "Sent" || i.status === "Overdue");
    const overdue = invoices.filter((i) => i.status === "Overdue");

    const totalRevenue = paid.reduce((s, i) => s + (i.amount || 0), 0);
    const outstandingTotal = outstanding.reduce((s, i) => s + (i.amount || 0), 0);
    const overdueTotal = overdue.reduce((s, i) => s + (i.amount || 0), 0);
    const avgInvoice = paid.length ? totalRevenue / paid.length : 0;

    // Revenue for the last 6 calendar months, bucketed by paid/created date.
    const now = new Date();
    const buckets: { key: string; month: string; revenue: number }[] = [];
    for (let k = 5; k >= 0; k--) {
      const d = new Date(now.getFullYear(), now.getMonth() - k, 1);
      buckets.push({ key: `${d.getFullYear()}-${d.getMonth()}`, month: MONTHS[d.getMonth()], revenue: 0 });
    }
    paid.forEach((i) => {
      const raw = i.paid_at || i.created_at;
      if (!raw) return;
      const d = new Date(raw);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      const b = buckets.find((x) => x.key === key);
      if (b) b.revenue += i.amount || 0;
    });

    // Top clients by paid revenue.
    const byClient = new Map<string, number>();
    paid.forEach((i) => {
      const name = i.client_name || "Unnamed";
      byClient.set(name, (byClient.get(name) || 0) + (i.amount || 0));
    });
    const topClients = [...byClient.entries()]
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    // Invoice status breakdown.
    const statusOrder = ["Draft", "Sent", "Paid", "Overdue", "Cancelled"] as const;
    const statusBreakdown = statusOrder
      .map((s) => ({ status: s, count: invoices.filter((i) => i.status === s).length }))
      .filter((x) => x.count > 0);

    // Project health.
    const healthOrder = ["Healthy", "At Risk", "Critical"];
    const health = healthOrder
      .map((h) => ({ health: h, count: projects.filter((p) => p.health === h).length }))
      .filter((x) => x.count > 0);

    return {
      totalRevenue,
      outstandingTotal,
      overdueTotal,
      overdueCount: overdue.length,
      avgInvoice,
      buckets,
      topClients,
      statusBreakdown,
      health,
      hasData: invoices.length > 0 || projects.length > 0,
    };
  }, [invoices, projects]);

  const exportCsv = () => {
    const header = ["Invoice", "Client", "Amount", "Status", "Created", "Paid"];
    const rows = invoices.map((i) => [
      i.invoice_number,
      i.client_name,
      String(i.amount ?? 0),
      i.status,
      (i.created_at || "").slice(0, 10),
      (i.paid_at || "").slice(0, 10),
    ]);
    const csv = [header, ...rows]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "rendahq-financial-summary.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const STATUS_FILL: Record<string, string> = {
    Draft: "#94a3b8",
    Sent: "#f59e0b",
    Paid: "#059669",
    Overdue: "#e11d48",
    Cancelled: "#cbd5e1",
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Financial Reports</h1>
            <p className="text-slate-500">Revenue, outstanding invoices, and project health — from your live data.</p>
          </div>
          <Button
            variant="outline"
            className="border-slate-200 gap-2"
            onClick={exportCsv}
            disabled={!canReports || invoices.length === 0}
          >
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>

        {isFree && !canReports && (
          <UpgradeBanner
            title="Advanced reports are an Agency feature"
            message="Revenue trends, outstanding balances, top clients, and tax-ready exports are included on the Agency plan. Upgrade to unlock them."
          />
        )}

        {loading ? (
          <div className="flex items-center justify-center py-24 text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : !canReports ? null : (
          <>
            {/* KPI row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="border-none shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600"><DollarSign className="w-5 h-5" /></div>
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <ArrowUpRight className="w-3 h-3" /> Paid
                    </span>
                  </div>
                  <p className="text-sm font-medium text-slate-500">Total Revenue</p>
                  <h3 className="text-2xl font-bold text-slate-900">{format(stats.totalRevenue)}</h3>
                </CardContent>
              </Card>
              <Card className="border-none shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 rounded-lg bg-amber-50 text-amber-600"><Wallet className="w-5 h-5" /></div>
                  </div>
                  <p className="text-sm font-medium text-slate-500">Outstanding</p>
                  <h3 className="text-2xl font-bold text-slate-900">{format(stats.outstandingTotal)}</h3>
                </CardContent>
              </Card>
              <Card className="border-none shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 rounded-lg bg-rose-50 text-rose-600"><AlertCircle className="w-5 h-5" /></div>
                    {stats.overdueCount > 0 && (
                      <span className="text-xs font-bold text-rose-600">{stats.overdueCount} overdue</span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-slate-500">Overdue</p>
                  <h3 className="text-2xl font-bold text-slate-900">{format(stats.overdueTotal)}</h3>
                </CardContent>
              </Card>
              <Card className="border-none shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 rounded-lg bg-blue-50 text-blue-600"><TrendingUp className="w-5 h-5" /></div>
                  </div>
                  <p className="text-sm font-medium text-slate-500">Avg. Paid Invoice</p>
                  <h3 className="text-2xl font-bold text-slate-900">{format(stats.avgInvoice)}</h3>
                </CardContent>
              </Card>
            </div>

            {!stats.hasData && (
              <Card className="border-none shadow-sm">
                <CardContent className="p-10 text-center text-slate-500">
                  <PieChart className="w-8 h-8 mx-auto mb-3 text-slate-300" />
                  <p className="font-medium text-slate-700">No financial data yet</p>
                  <p className="text-sm">Create invoices and projects and your reports will populate automatically.</p>
                </CardContent>
              </Card>
            )}

            {stats.hasData && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Revenue trend */}
                <Card className="border-none shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold">Revenue — last 6 months</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={stats.buckets}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} width={48} />
                          <Tooltip
                            formatter={(v: number) => format(v)}
                            contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
                          />
                          <Line type="monotone" dataKey="revenue" stroke="#059669" strokeWidth={3} dot={{ r: 4, fill: "#059669" }} activeDot={{ r: 6 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Top clients */}
                <Card className="border-none shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold">Top clients by revenue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {stats.topClients.length === 0 ? (
                      <p className="text-sm text-slate-400 text-center py-16">No paid invoices yet.</p>
                    ) : (
                      <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={stats.topClients} layout="vertical" margin={{ left: 10 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                            <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                            <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} width={90} tick={{ fill: "#64748b", fontSize: 12 }} />
                            <Tooltip
                              formatter={(v: number) => format(v)}
                              contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
                            />
                            <Bar dataKey="value" fill="#059669" radius={[0, 6, 6, 0]} barSize={22} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Invoice status */}
                <Card className="border-none shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold">Invoice status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {stats.statusBreakdown.length === 0 ? (
                      <p className="text-sm text-slate-400 text-center py-16">No invoices yet.</p>
                    ) : (
                      <div className="h-[260px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={stats.statusBreakdown}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="status" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                            <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} width={32} />
                            <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }} />
                            <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={40}>
                              {stats.statusBreakdown.map((s) => (
                                <Cell key={s.status} fill={STATUS_FILL[s.status] ?? "#94a3b8"} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Project health */}
                <Card className="border-none shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold">Project health</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {stats.health.length === 0 ? (
                      <p className="text-sm text-slate-400 text-center py-16">No projects yet.</p>
                    ) : (
                      stats.health.map((h) => {
                        const total = stats.health.reduce((s, x) => s + x.count, 0) || 1;
                        const pct = Math.round((h.count / total) * 100);
                        const color =
                          h.health === "Healthy" ? "bg-emerald-500" :
                          h.health === "At Risk" ? "bg-amber-500" : "bg-rose-500";
                        return (
                          <div key={h.health} className="space-y-1.5">
                            <div className="flex items-center justify-between text-sm">
                              <span className="font-medium text-slate-700">{h.health}</span>
                              <span className="text-slate-500">{h.count} project{h.count === 1 ? "" : "s"} · {pct}%</span>
                            </div>
                            <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                              <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        );
                      })
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Reports;
