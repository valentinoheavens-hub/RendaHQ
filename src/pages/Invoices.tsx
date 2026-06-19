import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Search,
  Download,
  ExternalLink,
  CreditCard,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/hooks/useCurrency";
import { invoiceStore, Invoice } from "@/lib/invoiceStore";

type FilterStatus = "All" | "Paid" | "Pending" | "Overdue";

const statusStyle = (status: string) =>
  cn(
    "border-none",
    status === "Paid" ? "bg-emerald-50 text-emerald-700" :
    status === "Overdue" ? "bg-rose-50 text-rose-700" :
    status === "Sent" ? "bg-blue-50 text-blue-700" :
    status === "Cancelled" ? "bg-red-50 text-red-700" :
    "bg-slate-100 text-slate-600"
  );

const Invoices = () => {
  const [activeFilter, setActiveFilter] = useState<FilterStatus>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const { format } = useCurrency();

  useEffect(() => {
    invoiceStore.getAll()
      .then(setInvoices)
      .catch(() => setInvoices([]))
      .finally(() => setLoading(false));
  }, []);

  const filters: FilterStatus[] = ["All", "Paid", "Pending", "Overdue"];

  const filtered = invoices.filter((inv) => {
    const matchesFilter =
      activeFilter === "All" ||
      inv.status === activeFilter ||
      (activeFilter === "Pending" && inv.status === "Sent");
    const matchesSearch =
      !searchQuery ||
      inv.invoice_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.client_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Invoices</h1>
            <p className="text-slate-500">Track payments and manage multi-currency billing.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-slate-200 gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
            <Link to="/invoice/new">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
                <Plus className="w-4 h-4" />
                Create Invoice
              </Button>
            </Link>
          </div>
        </div>

        {/* Payment Rails Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-none shadow-sm bg-slate-900 text-white">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Global Payments</p>
                <h3 className="text-xl font-bold">Stripe Connected</h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm bg-emerald-600 text-white">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-emerald-200 text-xs font-bold uppercase tracking-wider mb-1">African Rails</p>
                <h3 className="text-xl font-bold">Paystack & Flutterwave Active</h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm border-dashed border-2 border-slate-200 bg-transparent">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Mobile Money</p>
                <h3 className="text-xl font-bold text-slate-400">Connect M-Pesa</h3>
              </div>
              <Button variant="ghost" size="sm" className="text-emerald-600 hover:bg-emerald-50">Setup</Button>
            </CardContent>
          </Card>
        </div>

        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search invoices..."
                className="pl-10 bg-slate-50 border-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-1 bg-slate-50 rounded-xl p-1">
              {filters.map((f) => (
                <Button
                  key={f}
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveFilter(f)}
                  className={cn(
                    "rounded-lg text-sm transition-all",
                    activeFilter === f
                      ? "bg-white shadow-sm text-emerald-600 font-bold"
                      : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  {f}
                </Button>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-16 flex justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-16 text-center text-slate-400">
                <CreditCard className="w-8 h-8 mx-auto mb-3 opacity-40" />
                <p className="text-sm font-medium">
                  {invoices.length === 0
                    ? "No invoices yet. Create your first invoice."
                    : "No invoices match your filter."}
                </p>
                {invoices.length === 0 && (
                  <Link to="/invoice/new">
                    <Button className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
                      <Plus className="w-4 h-4" /> Create Invoice
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-slate-100">
                    <TableHead className="font-bold text-slate-900">Invoice #</TableHead>
                    <TableHead className="font-bold text-slate-900">Client</TableHead>
                    <TableHead className="font-bold text-slate-900">Amount</TableHead>
                    <TableHead className="font-bold text-slate-900">Status</TableHead>
                    <TableHead className="font-bold text-slate-900">Due Date</TableHead>
                    <TableHead className="font-bold text-slate-900">Method</TableHead>
                    <TableHead className="text-right" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((invoice) => (
                    <TableRow key={invoice.id} className="border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <TableCell className="font-medium text-slate-900">{invoice.invoice_number}</TableCell>
                      <TableCell className="text-slate-600">{invoice.client_name}</TableCell>
                      <TableCell className="font-bold text-slate-900">{format(invoice.amount)}</TableCell>
                      <TableCell>
                        <Badge className={statusStyle(invoice.status)}>{invoice.status}</Badge>
                      </TableCell>
                      <TableCell className="text-slate-500">
                        {invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : "—"}
                      </TableCell>
                      <TableCell className="text-slate-500">{invoice.payment_method ?? "—"}</TableCell>
                      <TableCell className="text-right">
                        <Link to={`/invoice/view/${invoice.id}`}>
                          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-emerald-600">
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Invoices;
