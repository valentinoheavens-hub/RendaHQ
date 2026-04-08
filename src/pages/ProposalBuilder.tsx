import React, { useState } from "react";
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
  Eye,
  FileText,
  Calendar,
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

const ProposalBuilder = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([
    { id: 1, description: "UI/UX Design Phase", amount: 3500 },
  ]);

  const addItem = () => {
    setItems([...items, { id: Date.now(), description: "", amount: 0 }]);
  };

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  const total = items.reduce((acc, item) => acc + item.amount, 0);

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/proposals")}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Create Proposal</h1>
              <p className="text-slate-500">Drafting a new quote for your client.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <Eye className="w-4 h-4" /> Preview
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
              <Send className="w-4 h-4" /> Send Proposal
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle>Proposal Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Proposal Title</Label>
                  <Input placeholder="e.g. Website Redesign & Branding" />
                </div>
                <div className="space-y-2">
                  <Label>Scope of Work</Label>
                  <Textarea 
                    placeholder="Describe the project objectives and deliverables in detail..." 
                    className="min-h-[200px]"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle>Investment & Deliverables</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-slate-100">
                      <TableHead className="font-bold text-slate-900">Description</TableHead>
                      <TableHead className="font-bold text-slate-900 w-40 text-right">Amount</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item) => (
                      <TableRow key={item.id} className="border-slate-50 hover:bg-transparent">
                        <TableCell>
                          <Input 
                            defaultValue={item.description} 
                            placeholder="e.g. Initial Discovery & Research" 
                            className="border-none bg-slate-50" 
                          />
                        </TableCell>
                        <TableCell>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
                            <Input 
                              type="number" 
                              defaultValue={item.amount} 
                              className="border-none bg-slate-50 pl-8 text-right" 
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-slate-400 hover:text-rose-500"
                            onClick={() => removeItem(item.id)}
                          >
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

                <div className="flex justify-end pt-8 border-t border-slate-100 mt-8">
                  <div className="w-64 flex justify-between items-center">
                    <span className="text-lg font-bold text-slate-900">Total Investment</span>
                    <span className="text-2xl font-black text-indigo-600">${total.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-400">Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Client</Label>
                  <Input defaultValue="Acme Corp" disabled />
                </div>
                <div className="space-y-2">
                  <Label>Valid Until</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input type="date" className="pl-10" />
                  </div>
                </div>
                <div className="pt-4">
                  <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">Terms & Conditions</Label>
                  <Textarea 
                    placeholder="Standard payment terms, revision policy, etc." 
                    className="mt-2 text-xs"
                    defaultValue="50% upfront deposit required. 2 rounds of revisions included."
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-slate-900 text-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5 text-indigo-400" />
                  <h4 className="font-bold">Proposal Template</h4>
                </div>
                <p className="text-slate-400 text-sm mb-4">
                  Save this structure as a template to reuse for future projects.
                </p>
                <Button className="w-full bg-white/10 hover:bg-white/20 text-white border-none">
                  Save as Template
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProposalBuilder;