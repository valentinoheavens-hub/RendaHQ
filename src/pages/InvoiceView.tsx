"use client";

import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  ChevronLeft,
  Download,
  Printer,
  CreditCard,
  CheckCircle2,
  Loader2,
  ExternalLink,
  Smartphone,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/hooks/useCurrency";
import { showSuccess, showError } from "@/utils/toast";
import { invoiceStore, Invoice } from "@/lib/invoiceStore";
import { clientStore } from "@/lib/clientStore";
import { getPaymentCurrency } from "@/lib/currency";

declare global {
  interface Window {
    PaystackPop: {
      setup: (opts: Record<string, unknown>) => { openIframe: () => void };
    };
    FlutterwaveCheckout: (opts: Record<string, unknown>) => void;
  }
}

const statusBadge = (status: string) =>
  cn(
    "border-none px-4 py-1 text-sm",
    status === "Paid" ? "bg-emerald-50 text-emerald-700" :
    status === "Overdue" ? "bg-rose-50 text-rose-700" :
    status === "Sent" ? "bg-blue-50 text-blue-700" :
    "bg-slate-100 text-slate-600"
  );

const InvoiceView = () => {
  const { invoiceId } = useParams();
  const navigate = useNavigate();
  const { format, code: currencyCode } = useCurrency();

  const [searchParams] = useSearchParams();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [clientEmail, setClientEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [flwLoading, setFlwLoading] = useState<string | null>(null);
  const [payingStripe, setPayingStripe] = useState(false);

  const paystackKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY as string | undefined;
  const flutterwaveKey = import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY as string | undefined;
  const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY as string | undefined;
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

  // Inject payment scripts once
  useEffect(() => {
    if (!document.getElementById("paystack-js")) {
      const s = document.createElement("script");
      s.id = "paystack-js";
      s.src = "https://js.paystack.co/v1/inline.js";
      s.async = true;
      document.body.appendChild(s);
    }
    if (!document.getElementById("flutterwave-js")) {
      const s = document.createElement("script");
      s.id = "flutterwave-js";
      s.src = "https://checkout.flutterwave.com/v3.js";
      s.async = true;
      document.body.appendChild(s);
    }
  }, []);

  useEffect(() => {
    if (!invoiceId) return;
    invoiceStore.getById(invoiceId).then(async (inv) => {
      if (!inv) { setLoading(false); return; }
      setInvoice(inv);
      if (inv.client_id) {
        const client = await clientStore.getById(inv.client_id);
        if (client?.email) setClientEmail(client.email);
      }
      setLoading(false);
    });
  }, [invoiceId]);

  // Handle Stripe redirect back to this page
  useEffect(() => {
    const payment = searchParams.get("payment");
    if (!payment || !invoiceId) return;
    if (payment === "success") {
      showSuccess("Payment successful! The invoice will be updated shortly.");
      // Reload invoice in case webhook already fired
      invoiceStore.getById(invoiceId).then((inv) => { if (inv) setInvoice(inv); });
    } else if (payment === "cancelled") {
      showError("Payment cancelled. The invoice has not been charged.");
    }
    // Clean the query param from the URL without re-rendering
    window.history.replaceState({}, "", window.location.pathname);
  }, [searchParams, invoiceId]);

  const handlePay = () => {
    if (!invoice) return;
    if (!paystackKey) {
      showError("Payment not configured. Add VITE_PAYSTACK_PUBLIC_KEY to your environment.");
      return;
    }
    if (!clientEmail) {
      showError("Please enter your email address to continue.");
      return;
    }

    setPaying(true);
    const ref = `NEX-${invoice.invoice_number}-${Date.now()}`;

    const handler = window.PaystackPop.setup({
      key: paystackKey,
      email: clientEmail,
      amount: Math.round(invoice.amount * 100), // smallest currency unit
      currency: getPaymentCurrency(currencyCode),
      ref,
      metadata: {
        invoice_id: invoice.id,
        invoice_number: invoice.invoice_number,
        client_name: invoice.client_name,
      },
      callback: async (response: { reference: string }) => {
        const updated = await invoiceStore.update(invoice.id, {
          status: "Paid",
          paystack_reference: response.reference,
          paid_at: new Date().toISOString(),
          payment_method: "Paystack",
        });
        if (updated) {
          setInvoice(updated);
          showSuccess("Payment successful! Invoice marked as paid.");
        }
        setPaying(false);
      },
      onClose: () => setPaying(false),
    });

    handler.openIframe();
  };

  const handleFlutterwavePayment = (paymentOptions: string) => {
    if (!invoice) return;
    if (!flutterwaveKey) {
      showError("Flutterwave not configured. Add VITE_FLUTTERWAVE_PUBLIC_KEY to your environment.");
      return;
    }
    if (!clientEmail) {
      showError("Please enter your email address to continue.");
      return;
    }

    setFlwLoading(paymentOptions);
    const txRef = `NEX-FLW-${invoice.invoice_number}-${Date.now()}`;

    window.FlutterwaveCheckout({
      public_key: flutterwaveKey,
      tx_ref: txRef,
      amount: invoice.amount,
      currency: getPaymentCurrency(currencyCode),
      payment_options: paymentOptions,
      customer: {
        email: clientEmail,
        name: invoice.client_name,
      },
      customizations: {
        title: "RendaHQ Invoice",
        description: `Payment for Invoice #${invoice.invoice_number}`,
        logo: `${window.location.origin}/favicon.svg`,
      },
      callback: async (data: { status: string; transaction_id: number; tx_ref: string }) => {
        if (data.status === "successful" || data.status === "completed") {
          const updated = await invoiceStore.update(invoice.id, {
            status: "Paid",
            paystack_reference: String(data.transaction_id),
            paid_at: new Date().toISOString(),
            payment_method: "Flutterwave",
          });
          if (updated) {
            setInvoice(updated);
            showSuccess("Payment successful! Invoice marked as paid.");
          }
        } else {
          showError("Payment was not completed. Please try again.");
        }
        setFlwLoading(null);
      },
      onclose: () => setFlwLoading(null),
    });
  };

  const handleStripeCheckout = async () => {
    if (!invoice) return;
    if (!stripePublishableKey) {
      showError("Stripe is not configured yet. Add VITE_STRIPE_PUBLIC_KEY to your environment.");
      return;
    }
    if (!clientEmail) {
      showError("Please enter your email address to continue.");
      return;
    }
    setPayingStripe(true);
    try {
      const origin = window.location.origin;
      const base = `${origin}/invoice/view/${invoice.id}`;
      const res = await fetch(`${supabaseUrl}/functions/v1/create-checkout-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${supabaseKey}`,
          apikey: supabaseKey,
        },
        body: JSON.stringify({
          invoiceId: invoice.id,
          invoiceNumber: invoice.invoice_number,
          amount: invoice.amount,
          clientName: invoice.client_name,
          email: clientEmail,
          successUrl: `${base}?payment=success`,
          cancelUrl: `${base}?payment=cancelled`,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.url) throw new Error(json.error ?? "Failed to create checkout session");
      window.location.href = json.url;
    } catch (err) {
      showError((err as Error).message);
      setPayingStripe(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-center">
        <div>
          <p className="text-slate-500 mb-4">Invoice not found.</p>
          <Button onClick={() => navigate("/invoices")}>Back to Invoices</Button>
        </div>
      </div>
    );
  }

  const items: Array<{ description: string; quantity: number; rate: number; amount: number }> =
    Array.isArray(invoice.items) ? invoice.items : [];
  const subtotal = items.reduce((s, i) => s + (i.amount ?? i.quantity * i.rate), 0) || invoice.amount;
  const isPaid = invoice.status === "Paid";
  const canPay = !isPaid && (invoice.status === "Sent" || invoice.status === "Overdue");

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Toolbar */}
        <div className="flex items-center justify-between no-print">
          <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
            <ChevronLeft className="w-4 h-4" /> Back
          </Button>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2" onClick={() => window.print()}>
              <Printer className="w-4 h-4" /> Print
            </Button>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
              onClick={() => window.print()}
            >
              <Download className="w-4 h-4" /> Download PDF
            </Button>
          </div>
        </div>

        {/* Pay panel */}
        {canPay && (
          <Card className="border-none shadow-sm bg-emerald-50 no-print">
            <CardContent className="p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-bold text-slate-900">Pay this invoice</h3>
                  <p className="text-sm text-slate-500">
                    Amount due:{" "}
                    <strong className="text-emerald-600">{format(invoice.amount)}</strong>
                  </p>
                </div>
                <Input
                  type="email"
                  placeholder="Your email address"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="h-10 bg-white border-slate-200 w-full sm:max-w-xs"
                />
              </div>

              {/* Card payments row */}
              <div className="space-y-1.5">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5" /> Card Payments
                </p>
                <div className="flex flex-wrap gap-2">
                  {paystackKey && (
                    <Button
                      onClick={handlePay}
                      disabled={paying || !clientEmail}
                      variant="outline"
                      className="gap-2 whitespace-nowrap border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                    >
                      {paying ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                      Paystack
                    </Button>
                  )}
                  {flutterwaveKey && (
                    <Button
                      onClick={() => handleFlutterwavePayment("card")}
                      disabled={!!flwLoading || !clientEmail}
                      variant="outline"
                      className="gap-2 whitespace-nowrap border-orange-200 text-orange-600 hover:bg-orange-50"
                    >
                      {flwLoading === "card" ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                      Flutterwave Card
                    </Button>
                  )}
                  <Button
                    onClick={handleStripeCheckout}
                    disabled={payingStripe || !clientEmail}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 whitespace-nowrap"
                    title={!stripePublishableKey ? "Stripe not configured yet" : undefined}
                  >
                    {payingStripe ? <Loader2 className="w-4 h-4 animate-spin" /> : <ExternalLink className="w-4 h-4" />}
                    Stripe
                  </Button>
                </div>
              </div>

              {/* Mobile money row — only shown when Flutterwave key present */}
              {flutterwaveKey && (
                <div className="space-y-1.5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5" /> Mobile Money · via Flutterwave
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      onClick={() => handleFlutterwavePayment("mobilemoney")}
                      disabled={!!flwLoading || !clientEmail}
                      variant="outline"
                      className="gap-2 whitespace-nowrap border-yellow-300 text-yellow-700 hover:bg-yellow-50"
                    >
                      {flwLoading === "mobilemoney" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Smartphone className="w-4 h-4" />}
                      MTN MoMo
                    </Button>
                    <Button
                      onClick={() => handleFlutterwavePayment("mpesa")}
                      disabled={!!flwLoading || !clientEmail}
                      variant="outline"
                      className="gap-2 whitespace-nowrap border-green-300 text-green-700 hover:bg-green-50"
                    >
                      {flwLoading === "mpesa" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Smartphone className="w-4 h-4" />}
                      M-Pesa
                    </Button>
                    <Button
                      onClick={() => handleFlutterwavePayment("ussd")}
                      disabled={!!flwLoading || !clientEmail}
                      variant="outline"
                      className="gap-2 whitespace-nowrap border-slate-200 text-slate-600 hover:bg-slate-50"
                    >
                      {flwLoading === "ussd" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Smartphone className="w-4 h-4" />}
                      USSD
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Paid confirmation */}
        {isPaid && (
          <Card className="border-none shadow-sm bg-emerald-50 no-print">
            <CardContent className="p-4 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <p className="text-sm text-emerald-800">
                Paid via {invoice.payment_method ?? "card"}
                {invoice.paid_at ? ` on ${new Date(invoice.paid_at).toLocaleDateString()}` : ""}.
                {invoice.paystack_reference && (
                  <> Ref: <span className="font-mono font-bold">{invoice.paystack_reference}</span></>
                )}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Invoice document */}
        <Card className="border-none shadow-2xl overflow-hidden bg-white">
          <div className="h-2 bg-emerald-600" />
          <CardContent className="p-12 space-y-12">

            {/* Agency + invoice number */}
            <div className="flex justify-between items-start">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center text-white font-bold text-3xl">
                  N
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">RendaHQ Design Studio</h2>
                  <p className="text-slate-500">123 Creative Way, Lagos, Nigeria</p>
                  <p className="text-slate-500">hello@rendahq.com</p>
                </div>
              </div>
              <div className="text-right space-y-2">
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">INVOICE</h1>
                <p className="text-lg font-bold text-slate-500">#{invoice.invoice_number}</p>
                <Badge className={statusBadge(invoice.status)}>
                  {isPaid && <CheckCircle2 className="w-4 h-4 mr-1 inline" />}
                  {invoice.status}
                </Badge>
              </div>
            </div>

            {/* Bill to + dates */}
            <div className="grid grid-cols-2 gap-12 py-12 border-y border-slate-100">
              <div className="space-y-4">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Bill To</p>
                <div>
                  <p className="text-lg font-bold text-slate-900">{invoice.client_name}</p>
                  {clientEmail && <p className="text-slate-500">{clientEmail}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Date Issued</p>
                  <p className="font-bold text-slate-900">
                    {new Date(invoice.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Due Date</p>
                  <p className="font-bold text-slate-900">
                    {invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : "—"}
                  </p>
                </div>
              </div>
            </div>

            {/* Line items */}
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Description</th>
                  <th className="text-center py-4 text-xs font-bold uppercase tracking-widest text-slate-400 w-24">Qty</th>
                  <th className="text-right py-4 text-xs font-bold uppercase tracking-widest text-slate-400 w-32">Rate</th>
                  <th className="text-right py-4 text-xs font-bold uppercase tracking-widest text-slate-400 w-32">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {items.length > 0 ? (
                  items.map((item, i) => (
                    <tr key={i}>
                      <td className="py-6 text-slate-900 font-medium">{item.description}</td>
                      <td className="py-6 text-center text-slate-600">{item.quantity}</td>
                      <td className="py-6 text-right text-slate-600">{format(item.rate)}</td>
                      <td className="py-6 text-right text-slate-900 font-bold">{format(item.amount)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="py-6 text-slate-900 font-medium">{invoice.client_name} — Services</td>
                    <td className="py-6 text-center text-slate-600">1</td>
                    <td className="py-6 text-right text-slate-600">{format(invoice.amount)}</td>
                    <td className="py-6 text-right text-slate-900 font-bold">{format(invoice.amount)}</td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Totals */}
            <div className="flex justify-end pt-12">
              <div className="w-72 space-y-4">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span className="font-medium text-slate-900">{format(subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Tax (0%)</span>
                  <span className="font-medium text-slate-900">{format(0)}</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                  <span className="text-lg font-bold text-slate-900">Total Amount</span>
                  <span className="text-2xl font-black text-emerald-600">{format(invoice.amount)}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="pt-12 border-t border-slate-100">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Notes</p>
              <p className="text-sm text-slate-500 leading-relaxed">
                {invoice.notes ||
                  "Thank you for your business! Please make payment within 14 days. For any questions regarding this invoice, please contact hello@rendahq.com."}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InvoiceView;
