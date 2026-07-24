"use client";

import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  CreditCard,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Clock,
  Send,
  Sparkles,
  Loader2,
  Copy,
  Check,
  TrendingUp,
  ArrowUpRight,
  Calendar,
  MoreVertical,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { generatePaymentReminder } from "@/lib/ai";
import { sendInvoiceReminder } from "@/lib/email";
import { showSuccess, showError } from "@/utils/toast";
import { Input } from "@/components/ui/input";
import { useCurrency } from "@/hooks/useCurrency";
import { invoiceStore, Invoice } from "@/lib/invoiceStore";
import { clientStore } from "@/lib/clientStore";
import { useAuth } from "@/context/AuthContext";

interface Payment {
  id: string;
  invoiceId: string;
  client: string;
  amountNum: number;
  status: "paid" | "pending" | "overdue";
  dueDate: string;
  daysOverdue?: number;
  method: string;
  clientId: string | null;
}

// Derives the payments view from real invoices.
const toPayment = (inv: Invoice): Payment => {
  const due = inv.due_date ? new Date(inv.due_date) : null;
  const overdueDays = due
    ? Math.floor((Date.now() - due.getTime()) / (1000 * 60 * 60 * 24))
    : 0;
  const status: Payment["status"] =
    inv.status === "Paid" ? "paid"
      : inv.status === "Overdue" || (due && overdueDays > 0 && inv.status !== "Draft") ? "overdue"
      : "pending";
  return {
    id: inv.id,
    invoiceId: inv.invoice_number,
    client: inv.client_name,
    amountNum: Number(inv.amount) || 0,
    status,
    dueDate: due ? due.toLocaleDateString() : "No due date",
    daysOverdue: status === "overdue" && overdueDays > 0 ? overdueDays : undefined,
    method: inv.payment_method || "Not set",
    clientId: inv.client_id ?? null,
  };
};

const statusConfig = {
  paid: { label: "Paid", color: "bg-emerald-50 text-emerald-700", icon: CheckCircle2, iconColor: "text-emerald-500" },
  pending: { label: "Pending", color: "bg-amber-50 text-amber-700", icon: Clock, iconColor: "text-amber-500" },
  overdue: { label: "Overdue", color: "bg-rose-50 text-rose-700", icon: AlertCircle, iconColor: "text-rose-500" },
};

export default function Payments() {
  const { format } = useCurrency();
  const { profile } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<"all" | "overdue" | "pending" | "paid">("all");
  const [reminderPayment, setReminderPayment] = useState<Payment | null>(null);
  const [reminderText, setReminderText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [clientEmail, setClientEmail] = useState("");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    invoiceStore.getAll()
      .then((invs) => setPayments(invs.map(toPayment)))
      .catch(() => setPayments([]))
      .finally(() => setLoading(false));
  }, []);

  // Prefill the client's email when opening the reminder dialog.
  useEffect(() => {
    if (!reminderPayment?.clientId) { setClientEmail(""); return; }
    clientStore.getById(reminderPayment.clientId)
      .then((c) => setClientEmail(c?.email ?? ""))
      .catch(() => setClientEmail(""));
  }, [reminderPayment]);

  const filtered = payments.filter(p => activeFilter === "all" || p.status === activeFilter);

  const totalCollected = payments.filter(p => p.status === "paid").reduce((s, p) => s + p.amountNum, 0);
  const totalPending = payments.filter(p => p.status === "pending").reduce((s, p) => s + p.amountNum, 0);
  const totalOverdue = payments.filter(p => p.status === "overdue").reduce((s, p) => s + p.amountNum, 0);

  const openReminder = (p: Payment) => {
    setReminderPayment(p);
    setReminderText("");
    setClientEmail("");
  };

  const generateReminder = async () => {
    if (!reminderPayment || isGenerating) return;
    setIsGenerating(true);
    try {
      const text = await generatePaymentReminder({
        clientName: reminderPayment.client,
        invoiceId: reminderPayment.invoiceId,
        amount: format(reminderPayment.amountNum),
        daysOverdue: reminderPayment.daysOverdue ?? 0,
        senderName: profile?.full_name ?? profile?.agency_name ?? "Your agency",
      });
      setReminderText(text);
    } catch (err: any) {
      showError(err.message ?? "Failed to generate reminder");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyReminder = () => {
    navigator.clipboard.writeText(reminderText);
    setCopied(true);
    showSuccess("Reminder copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Payment Tracking</h1>
            <p className="text-slate-500">Monitor all payments, chase overdue invoices, and track cash flow.</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-none shadow-sm bg-emerald-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-white/20">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <span className="text-emerald-200 text-xs font-bold flex items-center gap-1">
                  <ArrowUpRight className="w-3 h-3" /> Collected
                </span>
              </div>
              <p className="text-emerald-100 text-sm font-medium">Total Collected</p>
              <h3 className="text-3xl font-black">{format(totalCollected)}</h3>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
                  <Clock className="w-5 h-5" />
                </div>
                <Badge className="bg-amber-50 text-amber-700 border-none">Awaited</Badge>
              </div>
              <p className="text-sm font-medium text-slate-500">Pending Payments</p>
              <h3 className="text-2xl font-bold text-slate-900">{format(totalPending)}</h3>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-rose-50 text-rose-600">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <Badge className="bg-rose-50 text-rose-700 border-none">Action needed</Badge>
              </div>
              <p className="text-sm font-medium text-slate-500">Overdue Amount</p>
              <h3 className="text-2xl font-bold text-rose-600">{format(totalOverdue)}</h3>
            </CardContent>
          </Card>
        </div>

        {/* Filter tabs + List */}
        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-lg font-bold">All Payments</CardTitle>
            <div className="flex gap-1 bg-slate-50 rounded-xl p-1">
              {(["all", "overdue", "pending", "paid"] as const).map((f) => (
                <Button
                  key={f}
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveFilter(f)}
                  className={cn(
                    "rounded-lg text-xs capitalize transition-all",
                    activeFilter === f
                      ? "bg-white shadow-sm text-emerald-600 font-bold"
                      : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  {f}
                  {f === "overdue" && totalOverdue > 0 && (
                    <span className="ml-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] flex items-center justify-center">
                      {payments.filter(p => p.status === "overdue").length}
                    </span>
                  )}
                </Button>
              ))}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-50">
              {filtered.map((payment) => {
                const cfg = statusConfig[payment.status];
                const StatusIcon = cfg.icon;
                return (
                  <div
                    key={payment.id}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50/50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl border border-slate-100 shrink-0 bg-emerald-50 flex items-center justify-center font-bold text-emerald-700">
                      {(payment.client || "?").charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h4 className="font-bold text-slate-900 text-sm">{payment.client}</h4>
                        <Badge variant="secondary" className="bg-slate-100 text-slate-500 border-none text-[10px]">
                          {payment.invoiceId}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> Due {payment.dueDate}
                        </span>
                        <span>·</span>
                        <span>{payment.method}</span>
                        {payment.daysOverdue && (
                          <>
                            <span>·</span>
                            <span className="text-rose-500 font-bold">{payment.daysOverdue} days overdue</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <span className="font-bold text-slate-900 text-sm">{format(payment.amountNum)}</span>
                      <Badge className={cn("border-none gap-1", cfg.color)}>
                        <StatusIcon className={cn("w-3 h-3", cfg.iconColor)} />
                        {cfg.label}
                      </Badge>
                      {payment.status !== "paid" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className={cn(
                            "gap-1.5 text-xs",
                            payment.status === "overdue"
                              ? "border-rose-200 text-rose-600 hover:bg-rose-50"
                              : "border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                          )}
                          onClick={() => openReminder(payment)}
                        >
                          <Sparkles className="w-3 h-3" />
                          {payment.status === "overdue" ? "Send Reminder" : "Follow Up"}
                        </Button>
                      )}
                      {payment.status === "paid" && (
                        <Button size="sm" variant="ghost" className="text-slate-300 h-8 w-8 p-0">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Payment Timeline */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Cash Flow Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { month: "October 2023", collected: format(9300), pending: format(0), note: "2 invoices paid" },
                { month: "November 2023", collected: format(0), pending: format(6250), note: "2 invoices pending" },
              ].map((row) => (
                <div key={row.month} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50">
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-sm">{row.month}</p>
                    <p className="text-xs text-slate-400">{row.note}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400 mb-0.5">Collected</p>
                    <p className="font-bold text-emerald-600 text-sm">{row.collected}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400 mb-0.5">Expected</p>
                    <p className="font-bold text-amber-600 text-sm">{row.pending}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Reminder Dialog */}
      <Dialog open={!!reminderPayment} onOpenChange={(open) => !open && setReminderPayment(null)}>
        <DialogContent className="sm:max-w-[520px] rounded-3xl border-none shadow-2xl p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-4">
            <div className="flex items-center gap-2 mb-1">
              <div className={cn(
                "w-8 h-8 rounded-xl flex items-center justify-center",
                reminderPayment?.status === "overdue" ? "bg-rose-50" : "bg-emerald-50"
              )}>
                <Send className={cn("w-4 h-4", reminderPayment?.status === "overdue" ? "text-rose-600" : "text-emerald-600")} />
              </div>
              <DialogTitle className="text-lg font-bold">
                {reminderPayment?.status === "overdue" ? "Payment Reminder" : "Follow-up Message"}
              </DialogTitle>
            </div>
            <DialogDescription>
              Draft a personalised message to <strong>{reminderPayment?.client}</strong> for <strong>{reminderPayment?.invoiceId}</strong> ({format(reminderPayment?.amountNum ?? 0)}).
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 pb-6 space-y-4">
            <Button
              variant="outline"
              className="w-full gap-2 border-emerald-200 text-emerald-600 hover:bg-emerald-50"
              onClick={generateReminder}
              disabled={isGenerating}
            >
              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {isGenerating ? "Generating…" : reminderText ? "Regenerate with AI" : "Generate AI Draft"}
            </Button>

            {(reminderText || isGenerating) && (
              <div className="space-y-2">
                <Textarea
                  value={reminderText}
                  onChange={(e) => setReminderText(e.target.value)}
                  placeholder="Your reminder will appear here…"
                  className="min-h-[220px] resize-none border-slate-200 focus-visible:ring-emerald-500 text-sm leading-relaxed"
                  disabled={isGenerating}
                />
              </div>
            )}

            {!reminderText && !isGenerating && (
              <div className="py-10 text-center text-slate-400">
                <Sparkles className="w-8 h-8 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Click "Generate AI Draft" to create a personalised reminder.</p>
              </div>
            )}

            {reminderText && (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-600">Client Email Address</label>
                <Input
                  type="email"
                  placeholder="client@example.com"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="h-9 border-slate-200 focus-visible:ring-emerald-500 text-sm"
                />
              </div>
            )}

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 border-slate-200"
                onClick={() => setReminderPayment(null)}
              >
                Cancel
              </Button>
              {reminderText && (
                <Button
                  variant="outline"
                  className="gap-2 border-slate-200"
                  onClick={copyReminder}
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copied!" : "Copy"}
                </Button>
              )}
              <Button
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
                disabled={!reminderText || !clientEmail || isSending}
                onClick={async () => {
                  if (!reminderPayment || !clientEmail) return;
                  setIsSending(true);
                  const result = await sendInvoiceReminder({
                    clientEmail,
                    clientName: reminderPayment.client,
                    invoiceId: reminderPayment.invoiceId,
                    amount: format(reminderPayment.amountNum),
                    dueDate: reminderPayment.dueDate,
                    body: reminderText,
                  });
                  setIsSending(false);
                  if (result.success) {
                    showSuccess(`Reminder sent to ${reminderPayment.client}!`);
                    setReminderPayment(null);
                  } else {
                    showError(result.error || "Failed to send email.");
                  }
                }}
              >
                {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {isSending ? "Sending…" : "Send Email"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
