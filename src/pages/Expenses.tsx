"use client";

import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Search, 
  Download, 
  Receipt, 
  Tag, 
  Calendar,
  MoreVertical,
  ArrowUpRight,
  Filter,
  FileText
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

const Expenses = () => {
  const expenses = [
    { id: 1, merchant: "Adobe Creative Cloud", category: "Software", amount: "$54.99", date: "Oct 28, 2023", status: "Deductible", method: "Visa •••• 4242" },
    { id: 2, merchant: "DigitalOcean", category: "Hosting", amount: "$12.00", date: "Oct 25, 2023", status: "Deductible", method: "Visa •••• 4242" },
    { id: 3, merchant: "Starbucks", category: "Meals", amount: "$18.50", date: "Oct 22, 2023", status: "Personal", method: "Cash" },
    { id: 4, merchant: "Apple Store", category: "Hardware", amount: "$1,299.00", date: "Oct 15, 2023", status: "Deductible", method: "Visa •••• 4242" },
    { id: 5, merchant: "Google Workspace", category: "Software", amount: "$12.00", date: "Oct 01, 2023", status: "Deductible", method: "Visa •••• 4242" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Expenses</h1>
            <p className="text-slate-500">Track your business spending and manage tax deductions.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-slate-200 gap-2">
              <Download className="w-4 h-4" />
              Export for Tax
            </Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
              <Plus className="w-4 h-4" />
              Log Expense
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <p className="text-sm font-medium text-slate-500 mb-1">Total Spent (Oct)</p>
              <h3 className="text-2xl font-bold text-slate-900">$1,396.49</h3>
              <div className="mt-2 flex items-center gap-1 text-xs text-rose-600 font-bold">
                <ArrowUpRight className="w-3 h-3" /> +42% from last month
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <p className="text-sm font-medium text-slate-500 mb-1">Tax Deductible</p>
              <h3 className="text-2xl font-bold text-emerald-600">$1,377.99</h3>
              <p className="text-[10px] text-slate-400 mt-2">98% of total spending</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm bg-emerald-600 text-white">
            <CardContent className="p-6">
              <p className="text-emerald-100 text-sm font-medium mb-1">Receipts Missing</p>
              <h3 className="text-2xl font-bold">2 Items</h3>
              <Button variant="link" className="text-white p-0 h-auto text-xs font-bold mt-2 opacity-80 hover:opacity-100">
                Upload Now →
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input placeholder="Search expenses..." className="pl-10 bg-slate-50 border-none" />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="border-slate-200 gap-2">
                <Filter className="w-3.5 h-3.5" /> Filter
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-slate-100">
                  <TableHead className="font-bold text-slate-900">Merchant</TableHead>
                  <TableHead className="font-bold text-slate-900">Category</TableHead>
                  <TableHead className="font-bold text-slate-900">Date</TableHead>
                  <TableHead className="font-bold text-slate-900">Status</TableHead>
                  <TableHead className="font-bold text-slate-900">Amount</TableHead>
                  <TableHead className="text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.map((expense) => (
                  <TableRow key={expense.id} className="border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                          <Receipt className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{expense.merchant}</p>
                          <p className="text-[10px] text-slate-400">{expense.method}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-none text-[10px]">
                        {expense.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-slate-500">{expense.date}</TableCell>
                    <TableCell>
                      <Badge className={cn(
                        "border-none text-[10px]",
                        expense.status === "Deductible" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"
                      )}>
                        {expense.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-bold text-slate-900">{expense.amount}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" className="text-slate-400 h-8 w-8">
                          <FileText className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-slate-400 h-8 w-8">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Expenses;