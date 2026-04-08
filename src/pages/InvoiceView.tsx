import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  Download, 
  Printer, 
  Share2, 
  CreditCard,
  CheckCircle2
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const InvoiceView = () => {
  const { invoiceId } = useParams();
  const navigate = useNavigate();

  const invoice = {
    id: "INV-2023-001",
    status: "Paid",
    date: "Oct 12, 2023",
    dueDate: "Oct 26, 2023",
    client: {
      name: "Acme Corp",
      address: "456 Corporate Blvd, San Francisco, CA",
      email: "billing@acme.com"
    },
    items: [
      { description: "Brand Identity Discovery Phase", qty: 1, rate: 1500, amount: 1500 },
      { description: "Initial Logo Concepts", qty: 1, rate: 2000, amount: 2000 },
    ],
    subtotal: 3500,
    tax: 0,
    total: 3500
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between no-print">
          <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
            <ChevronLeft className="w-4 h-4" /> Back
          </Button>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <Share2 className="w-4 h-4" /> Share
            </Button>
            <Button variant="outline" className="gap-2" onClick={() => window.print()}>
              <Printer className="w-4 h-4" /> Print
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
              <Download className="w-4 h-4" /> Download PDF
            </Button>
          </div>
        </div>

        <Card className="border-none shadow-2xl overflow-hidden bg-white">
          <div className="h-2 bg-indigo-600" />
          <CardContent className="p-12 space-y-12">
            <div className="flex justify-between items-start">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-3xl">N</div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">NexWork Design Studio</h2>
                  <p className="text-slate-500">123 Creative Way, Lagos, Nigeria</p>
                  <p className="text-slate-500">hello@nexwork.io</p>
                </div>
              </div>
              <div className="text-right space-y-2">
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">INVOICE</h1>
                <p className="text-lg font-bold text-slate-500">#{invoice.id}</p>
                <Badge className="bg-emerald-50 text-emerald-700 border-none px-4 py-1 text-sm">
                  <CheckCircle2 className="w-4 h-4 mr-1 inline" /> {invoice.status}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-12 py-12 border-y border-slate-100">
              <div className="space-y-4">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Bill To</p>
                <div>
                  <p className="text-lg font-bold text-slate-900">{invoice.client.name}</p>
                  <p className="text-slate-500 leading-relaxed">{invoice.client.address}</p>
                  <p className="text-slate-500">{invoice.client.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Date Issued</p>
                  <p className="font-bold text-slate-900">{invoice.date}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Due Date</p>
                  <p className="font-bold text-slate-900">{invoice.dueDate}</p>
                </div>
              </div>
            </div>

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
                {invoice.items.map((item, i) => (
                  <tr key={i}>
                    <td className="py-6 text-slate-900 font-medium">{item.description}</td>
                    <td className="py-6 text-center text-slate-600">{item.qty}</td>
                    <td className="py-6 text-right text-slate-600">${item.rate.toLocaleString()}</td>
                    <td className="py-6 text-right text-slate-900 font-bold">${item.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end pt-12">
              <div className="w-72 space-y-4">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span className="font-medium text-slate-900">${invoice.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Tax (0%)</span>
                  <span className="font-medium text-slate-900">$0.00</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                  <span className="text-lg font-bold text-slate-900">Total Amount</span>
                  <span className="text-2xl font-black text-indigo-600">${invoice.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="pt-12 border-t border-slate-100">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Notes</p>
              <p className="text-sm text-slate-500 leading-relaxed">
                Thank you for your business! Please make payment within 14 days. 
                For any questions regarding this invoice, please contact billing@nexwork.io.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InvoiceView;