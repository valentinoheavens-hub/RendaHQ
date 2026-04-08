import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ChevronLeft, 
  Plus, 
  Trash2, 
  Send, 
  Download,
  DollarSign
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

const InvoiceBuilder = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([
    { id: 1, description: "Initial Deposit - Brand Identity", quantity: 1, rate: 2500 },
  ]);

  const addItem = () => {
    setItems([...items, { id: Date.now(), description: "", quantity: 1, rate: 0 }]);
  };

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  const subtotal = items.reduce((acc, item) => acc + (item.quantity * item.rate), 0);

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
              <p className="text-slate-500">Drafting INV-2023-005</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" /> Download
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
              <Send className="w-4 h-4" /> Send Invoice
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-none shadow-sm">
              <CardContent className="p-8 space-y-8">
                <div className="flex justify-between">
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl">N</div>
                    <div>
                      <p className="font-bold text-slate-900">NexWork Design Studio</p>
                      <p className="text-sm text-slate-500">123 Creative Way</p>
                      <p className="text-sm text-slate-500">Lagos, Nigeria</p>
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <h2 className="text-3xl font-bold text-slate-900">INVOICE</h2>
                    <p className="text-sm text-slate-500">#INV-2023-005</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-100">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">Bill To</Label>
                    <Input placeholder="Client Name" defaultValue="Acme Corp" />
                    <Textarea placeholder="Client Address" defaultValue="456 Corporate Blvd, San Francisco, CA" className="min-h-[80px]" />
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">Invoice Date</Label>
                        <Input type="date" defaultValue="2023-10-28" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">Due Date</Label>
                        <Input type="date" defaultValue="2023-11-11" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-8">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent border-slate-100">
                        <TableHead className="font-bold text-slate-900">Description</TableHead>
                        <TableHead className="font-bold text-slate-900 w-24">Qty</TableHead>
                        <TableHead className="font-bold text-slate-900 w-32">Rate</TableHead>
                        <TableHead className="font-bold text-slate-900 w-32 text-right">Amount</TableHead>
                        <TableHead className="w-12"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.map((item) => (
                        <TableRow key={item.id} className="border-slate-50 hover:bg-transparent">
                          <TableCell>
                            <Input defaultValue={item.description} placeholder="Item description" className="border-none bg-slate-50" />
                          </TableCell>
                          <TableCell>
                            <Input type="number" defaultValue={item.quantity} className="border-none bg-slate-50" />
                          </TableCell>
                          <TableCell>
                            <Input type="number" defaultValue={item.rate} className="border-none bg-slate-50" />
                          </TableCell>
                          <TableCell className="text-right font-bold text-slate-900">
                            ${(item.quantity * item.rate).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-rose-500" onClick={() => removeItem(item.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <Button variant="ghost" className="mt-4 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50" onClick={addItem}>
                    <Plus className="w-4 h-4 mr-2" /> Add Line Item
                  </Button>
                </div>

                <div className="flex justify-end pt-8 border-t border-slate-100">
                  <div className="w-64 space-y-3">
                    <div className="flex justify-between text-slate-500">
                      <span>Subtotal</span>
                      <span>${subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Tax (0%)</span>
                      <span>$0.00</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold text-slate-900 pt-3 border-t border-slate-100">
                      <span>Total</span>
                      <span>${subtotal.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-400">Payment Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Input defaultValue="USD ($)" disabled />
                </div>
                <div className="space-y-2">
                  <Label>Payment Method</Label>
                  <div className="p-3 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-between">
                    <span className="text-sm font-medium">Stripe</span>
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                </div>
                <div className="pt-4">
                  <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">Notes to Client</Label>
                  <Textarea placeholder="Thank you for your business!" className="mt-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default InvoiceBuilder;