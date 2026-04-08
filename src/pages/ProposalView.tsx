import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, 
  Download, 
  Printer, 
  FileText, 
  ShieldCheck,
  ArrowRight,
  Clock
} from "lucide-react";
import { showSuccess } from "@/utils/toast";

const ProposalView = () => {
  const { proposalId } = useParams();
  const navigate = useNavigate();
  const [isAccepted, setIsAccepted] = useState(false);

  const proposal = {
    id: "PROP-2023-042",
    title: "Website Redesign & Brand Identity",
    status: "Pending",
    date: "Oct 28, 2023",
    validUntil: "Nov 11, 2023",
    client: "Acme Corp",
    agency: "NexWork Design Studio",
    scope: "A complete overhaul of the Acme Corp digital presence, including a new visual identity system and a high-performance marketing website built on React.",
    items: [
      { description: "Brand Strategy & Visual Identity", amount: 2500 },
      { description: "UI/UX Design (5 Key Pages)", amount: 3000 },
      { description: "Frontend Development & CMS Integration", amount: 4500 },
    ],
    total: 10000
  };

  const handleAccept = () => {
    setIsAccepted(true);
    showSuccess("Proposal accepted! We'll notify the agency and prepare the contract.");
  };

  if (isAccepted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <Card className="max-w-md w-full border-none shadow-2xl text-center p-8">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Proposal Accepted!</h2>
          <p className="text-slate-500 mb-8">
            Thank you for choosing {proposal.agency}. We've been notified and are preparing the next steps for your project.
          </p>
          <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => navigate("/")}>
            Return to Home
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between no-print">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">N</div>
            <div>
              <h1 className="font-bold text-slate-900">Proposal for {proposal.client}</h1>
              <p className="text-xs text-slate-500">From {proposal.agency}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" /> PDF
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2" onClick={handleAccept}>
              Accept Proposal <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <Card className="border-none shadow-2xl overflow-hidden bg-white">
          <div className="h-2 bg-indigo-600" />
          <CardContent className="p-12 space-y-12">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <Badge className="bg-indigo-50 text-indigo-700 border-none mb-2">Project Proposal</Badge>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">{proposal.title}</h1>
                <div className="flex items-center gap-4 text-slate-500 text-sm">
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> Issued: {proposal.date}</span>
                  <span className="flex items-center gap-1 text-rose-600 font-medium"><Clock className="w-4 h-4" /> Valid until: {proposal.validUntil}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Total Investment</p>
                <p className="text-4xl font-black text-indigo-600">${proposal.total.toLocaleString()}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                Executive Summary
              </h3>
              <p className="text-slate-600 leading-relaxed text-lg">
                {proposal.scope}
              </p>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-900">Investment Breakdown</h3>
              <div className="rounded-2xl border border-slate-100 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="text-left p-4 text-xs font-bold uppercase tracking-widest text-slate-400">Deliverable</th>
                      <th className="text-right p-4 text-xs font-bold uppercase tracking-widest text-slate-400">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {proposal.items.map((item, i) => (
                      <tr key={i}>
                        <td className="p-4 text-slate-700 font-medium">{item.description}</td>
                        <td className="p-4 text-right text-slate-900 font-bold">${item.amount.toLocaleString()}</td>
                      </tr>
                    ))}
                    <tr className="bg-indigo-50/30">
                      <td className="p-4 text-slate-900 font-bold">Total Project Investment</td>
                      <td className="p-4 text-right text-indigo-600 font-black text-xl">${proposal.total.toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-slate-100">
              <div className="space-y-4">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  Terms & Conditions
                </h4>
                <ul className="space-y-2 text-sm text-slate-500">
                  <li className="flex gap-2">• 50% upfront deposit required to commence work.</li>
                  <li className="flex gap-2">• 2 rounds of revisions included per phase.</li>
                  <li className="flex gap-2">• Final files delivered upon receipt of final payment.</li>
                </ul>
              </div>
              <div className="bg-slate-50 rounded-2xl p-6 space-y-4">
                <h4 className="font-bold text-slate-900">Ready to start?</h4>
                <p className="text-sm text-slate-500">
                  By clicking "Accept Proposal", you agree to the terms outlined above. We will follow up with a formal contract and deposit invoice.
                </p>
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-6 text-lg font-bold rounded-xl" onClick={handleAccept}>
                  Accept & Start Project
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProposalView;