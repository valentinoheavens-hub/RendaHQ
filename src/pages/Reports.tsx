import React from "react";
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
  Line
} from "recharts";
import { 
  TrendingUp, 
  DollarSign, 
  PieChart, 
  ArrowUpRight,
  Download,
  ShieldCheck,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCurrency } from "@/hooks/useCurrency";

const Reports = () => {
  const { format } = useCurrency();
  const revenueData = [
    { month: "Jan", revenue: 4500 },
    { month: "Feb", revenue: 5200 },
    { month: "Mar", revenue: 4800 },
    { month: "Apr", revenue: 6100 },
    { month: "May", revenue: 5900 },
    { month: "Jun", revenue: 7200 },
  ];

  const projectProfitability = [
    { name: "Acme Corp", profit: 8500, cost: 2000 },
    { name: "Global Tech", profit: 6200, cost: 1500 },
    { name: "Zest Foods", profit: 3800, cost: 800 },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Financial Reports</h1>
            <p className="text-slate-500">Insights into your business performance and tax readiness.</p>
          </div>
          <Button variant="outline" className="border-slate-200 gap-2">
            <Download className="w-4 h-4" />
            Export Financial Summary
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                  <DollarSign className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                  <ArrowUpRight className="w-3 h-3" /> +18%
                </span>
              </div>
              <p className="text-sm font-medium text-slate-500">YTD Revenue</p>
              <h3 className="text-2xl font-bold text-slate-900">{format(42850)}</h3>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                  <PieChart className="w-5 h-5" />
                </div>
              </div>
              <p className="text-sm font-medium text-slate-500">Estimated Tax Liability</p>
              <h3 className="text-2xl font-bold text-slate-900">{format(8570)}</h3>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>
              <p className="text-sm font-medium text-slate-500">Avg. Project Value</p>
              <h3 className="text-2xl font-bold text-slate-900">{format(5350)}</h3>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Revenue Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Line type="monotone" dataKey="revenue" stroke="#059669" strokeWidth={3} dot={{ r: 4, fill: '#059669' }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Tax Readiness Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-slate-50 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm font-medium text-slate-700">VAT/GST Collected</span>
                  </div>
                  <span className="font-bold text-slate-900">{format(3420)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                    <span className="text-sm font-medium text-slate-700">Deductible Expenses</span>
                  </div>
                  <span className="font-bold text-slate-900">{format(1250)}</span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-xs text-slate-500">
                  Based on your current revenue, we recommend setting aside 20% for quarterly tax payments.
                </p>
                <Button className="w-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-none">
                  Generate Tax Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Reports;