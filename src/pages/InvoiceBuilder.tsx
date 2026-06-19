"use client";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ChevronLeft,
  Plus,
  Trash2,
  Send,
  Save,
  Loader2,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { showSuccess, showError } from "@/utils/toast";
import { invoiceStore } from "@/lib/invoiceStore";
import { clientStore, Client } from "@/lib/clientStore";
import { useCurrency } from "@/hooks/useCurrency";

interface LineItem {
  id: number;
  description: string;
  quantity: number;
  rate: number;
}

const InvoiceBuilder = () => {
  const navigate = useNavigate();
  const { format, symbol } = useCurrency();

  const [clients, setClients] = useState<Client[]>([]);
  const [invoiceNumber, setInvoiceNumber] = useState("INV-001");
  const [clientId, setClientId] = useState("");
  const [clientName, setClientName] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Paystack");
  const [saving, setSaving] = useState(false);
  const [items, setItems] = useState<LineItem[]>([
    { id: 1, description: "", quantity: 1, rate: 0 },
  ]);

  useEffect(() => {
    clientStore.getAll().then(setClients).catch(() => {});
    invoiceStore.nextInvoiceNumber().then(setInvoiceNumber).catch(() => {});
  }, []);

  const addItem = () => {
    setItems((prev) => [...prev, { id: Date.now(), description: "", quantity: 1, rate: 0 }]);
  };

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateItem = (id: number, field: keyof Omit<LineItem, "id">, value: string | number) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, [field]: value } : i))
    );
  };

  const handleClientChange = (id: string) => {
    setClientId(id);
    const c = clients.find((cl) => cl.id === id);
    if (c) setClientName(c.name);
  };

  const subtotal = items.reduce((s, i) => s + i.quantity * i.rate, 0);

  const save = async (status: "Draft" | "Sent") => {
    if (!clientName.trim()) { showError("Please select or enter a client name."); return; }
    if (items.every((i) => !i.description.trim())) { showError("Add at least one line item."); return; }

    setSaving(true);
    try {
      const lineItems = items
        .filter((i) => i.description.trim())
        .map((i) => ({
          description: i.description,
          quantity: i.quantity,
          rate: i.rate,
          amount: i.quantity * i.rate,
        }));

      const invoice = await invoiceStore.create({
        invoice_number: invoiceNumber,
        client_id: clientId || null,
        client_name: clientName,
        amount: subtotal,
        status,
        due_date: dueDate || null,
        payment_method: paymentMethod,
        items: lineItems,
        notes: notes || null,
        paystack_reference: null,
        paystack_access_code: null,
        paid_at: null,
      });

      showSuccess(status === "Sent" ? "Invoice sent!" : "Invoice saved as draft.");
      navigate(`/invoice/view/${invoice.id}`);
    } catch (e: any) {
      showError(e.message || "Failed to save invoice.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/invoices")}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Create Invoice</h1>
              <p className="text-slate-500">{invoiceNumber}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2" onClick={() => save("Draft")} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Draft
            </Button>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
              onClick={() => save("Sent")}
              disabled={saving}
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Send Invoice
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Invoice editor */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-none shadow-sm">
              <CardContent className="p-8 space-y-8">
                {/* Agency header */}
                <div className="flex justify-between">
                  <div className="space-y-3">
                    <div className="w-14 h-14 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl">
                      N
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">RendaHQ Design Studio</p>
                      <p className="text-sm text-slate-500">123 Creative Way, Lagos, Nigeria</p>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <h2 className="text-3xl font-bold text-slate-900">INVOICE</h2>
                    <p className="text-sm font-bold text-slate-400">{invoiceNumber}</p>
                  </div>
                </div>

                {/* Bill to + dates */}
                <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-100">
                  <div className="space-y-3">
                    <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Bill To
                    </Label>
                    {clients.length > 0 ? (
                      <select
                        value={clientId}
                        onChange={(e) => handleClientChange(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="">Select a client…</option>
                        {clients.map((c) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    ) : null}
                    <Input
                      placeholder="Client name"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Due Date
                      </Label>
                      <Input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Line items */}
                <div className="pt-4">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent border-slate-100">
                        <TableHead className="font-bold text-slate-900">Description</TableHead>
                        <TableHead className="font-bold text-slate-900 w-24">Qty</TableHead>
                        <TableHead className="font-bold text-slate-900 w-32">Rate ({symbol})</TableHead>
                        <TableHead className="font-bold text-slate-900 w-32 text-right">Amount</TableHead>
                        <TableHead className="w-12" />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.map((item) => (
                        <TableRow key={item.id} className="border-slate-50 hover:bg-transparent">
                          <TableCell>
                            <Input
                              value={item.description}
                              onChange={(e) => updateItem(item.id, "description", e.target.value)}
                              placeholder="Item description"
                              className="border-none bg-slate-50"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min={1}
                              value={item.quantity}
                              onChange={(e) => updateItem(item.id, "quantity", Number(e.target.value))}
                              className="border-none bg-slate-50"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min={0}
                              value={item.rate}
                              onChange={(e) => updateItem(item.id, "rate", Number(e.target.value))}
                              className="border-none bg-slate-50"
                            />
                          </TableCell>
                          <TableCell className="text-right font-bold text-slate-900">
                            {format(item.quantity * item.rate)}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-slate-400 hover:text-rose-500"
                              onClick={() => removeItem(item.id)}
                              disabled={items.length === 1}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <Button
                    variant="ghost"
                    className="mt-4 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                    onClick={addItem}
                  >
                    <Plus className="w-4 h-4 mr-2" /> Add Line Item
                  </Button>
                </div>

                {/* Totals */}
                <div className="flex justify-end pt-8 border-t border-slate-100">
                  <div className="w-64 space-y-3">
                    <div className="flex justify-between text-slate-500">
                      <span>Subtotal</span>
                      <span>{format(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Tax (0%)</span>
                      <span>{format(0)}</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold text-slate-900 pt-3 border-t border-slate-100">
                      <span>Total</span>
                      <span className="text-emerald-600">{format(subtotal)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-400">
                  Payment Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Payment Method</Label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option>Paystack</option>
                    <option>Flutterwave</option>
                    <option>Bank Transfer</option>
                    <option>Cash</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Notes to Client</Label>
                  <Textarea
                    placeholder="Thank you for your business!"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-emerald-50">
              <CardContent className="p-5 space-y-2">
                <p className="text-sm font-bold text-emerald-900">Total Due</p>
                <p className="text-3xl font-black text-emerald-600">{format(subtotal)}</p>
                <p className="text-xs text-emerald-500">
                  {dueDate ? `Due ${new Date(dueDate).toLocaleDateString()}` : "No due date set"}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default InvoiceBuilder;
