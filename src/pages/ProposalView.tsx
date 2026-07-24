import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Printer,
  ShieldCheck,
  Clock,
  Loader2,
  ChevronLeft,
  Send,
} from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";
import { cn } from "@/lib/utils";
import { proposalStore, Proposal } from "@/lib/proposalStore";
import { profileStore, Profile } from "@/lib/profileStore";
import { useAuth } from "@/context/AuthContext";
import { formatAmount } from "@/lib/currency";

// Minimal, dependency-free Markdown renderer for the AI-authored proposal body.
const renderMarkdown = (md: string) => {
  const lines = md.split("\n");
  const out: React.ReactNode[] = [];
  let list: string[] = [];

  const flushList = (key: string) => {
    if (!list.length) return;
    out.push(
      <ul key={key} className="list-disc pl-5 space-y-1.5 mb-4 text-slate-600">
        {list.map((li, i) => <li key={i}>{li}</li>)}
      </ul>
    );
    list = [];
  };

  lines.forEach((raw, i) => {
    const line = raw.trimEnd();
    if (/^#{3}\s+/.test(line)) {
      flushList(`l${i}`);
      out.push(<h3 key={i} className="text-base font-bold text-slate-900 mt-6 mb-2">{line.replace(/^#{3}\s+/, "")}</h3>);
    } else if (/^#{2}\s+/.test(line)) {
      flushList(`l${i}`);
      out.push(<h2 key={i} className="text-xl font-black text-slate-900 mt-8 mb-3">{line.replace(/^#{2}\s+/, "")}</h2>);
    } else if (/^#\s+/.test(line)) {
      flushList(`l${i}`);
      out.push(<h1 key={i} className="text-2xl font-black text-slate-900 mt-8 mb-3">{line.replace(/^#\s+/, "")}</h1>);
    } else if (/^[-*]\s+/.test(line)) {
      list.push(line.replace(/^[-*]\s+/, ""));
    } else if (!line.trim()) {
      flushList(`l${i}`);
    } else {
      flushList(`l${i}`);
      // Bold **text** inline
      const parts = line.split(/(\*\*[^*]+\*\*)/g).map((p, j) =>
        /^\*\*[^*]+\*\*$/.test(p)
          ? <strong key={j} className="font-bold text-slate-900">{p.slice(2, -2)}</strong>
          : <React.Fragment key={j}>{p}</React.Fragment>
      );
      out.push(<p key={i} className="text-slate-600 leading-relaxed mb-4">{parts}</p>);
    }
  });
  flushList("last");
  return out;
};

const ProposalView = () => {
  const { proposalId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [agency, setAgency] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);

  useEffect(() => {
    if (!proposalId) return;
    proposalStore.getById(proposalId)
      .then(async (p) => {
        setProposal(p);
        if (p?.user_id) setAgency(await profileStore.get(p.user_id));
      })
      .finally(() => setLoading(false));
  }, [proposalId]);

  const setStatus = async (status: Proposal["status"]) => {
    if (!proposal) return;
    setWorking(true);
    try {
      const updated = await proposalStore.update(proposal.id, { status });
      if (updated) setProposal(updated);
      showSuccess(`Proposal marked as ${status}.`);
    } catch (e: any) {
      showError(e.message || "Could not update the proposal.");
    } finally {
      setWorking(false);
    }
  };

  const money = (n: number) => formatAmount(n, proposal?.currency_code ?? "USD");

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <Card className="max-w-md w-full border-none shadow-xl text-center p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Proposal not found</h2>
          <p className="text-slate-500 mb-6">This proposal may have been deleted or the link is incorrect.</p>
          <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => navigate("/proposals")}>
            Back to proposals
          </Button>
        </Card>
      </div>
    );
  }

  const isOwner = user?.id === proposal.user_id;
  const agencyName = agency?.agency_name || "Your Agency";
  const brand = agency?.brand_color || "#059669";

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Toolbar — owner only */}
        {isOwner && (
          <div className="flex flex-wrap items-center justify-between gap-3 no-print">
            <Button variant="ghost" className="gap-2 text-slate-600" onClick={() => navigate("/proposals")}>
              <ChevronLeft className="w-4 h-4" /> All proposals
            </Button>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" className="gap-2" onClick={() => window.print()}>
                <Printer className="w-4 h-4" /> Print / PDF
              </Button>
              {proposal.status === "Draft" && (
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2" onClick={() => setStatus("Sent")} disabled={working}>
                  {working ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Mark as Sent
                </Button>
              )}
              {proposal.status === "Sent" && (
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2" onClick={() => setStatus("Accepted")} disabled={working}>
                  {working ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />} Mark as Accepted
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Document */}
        <Card className="border-none shadow-sm overflow-hidden">
          <div className="h-2" style={{ background: brand }} />
          <CardContent className="p-8 sm:p-12">
            {/* Header */}
            <div className="flex flex-wrap justify-between items-start gap-6 pb-8 border-b border-slate-100">
              <div className="flex items-center gap-3">
                {agency?.logo_url ? (
                  <img src={agency.logo_url} alt={agencyName} className="h-10 w-auto max-w-[140px] object-contain" />
                ) : (
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg" style={{ background: brand }}>
                    {agencyName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="font-bold text-slate-900">{agencyName}</p>
                  <p className="text-xs text-slate-500">Proposal</p>
                </div>
              </div>
              <div className="text-right">
                <Badge className={cn(
                  "border-none mb-2",
                  proposal.status === "Accepted" ? "bg-emerald-50 text-emerald-700" :
                  proposal.status === "Sent" ? "bg-blue-50 text-blue-700" :
                  proposal.status === "Declined" ? "bg-rose-50 text-rose-700" :
                  "bg-slate-100 text-slate-600"
                )}>
                  {proposal.status}
                </Badge>
                <p className="text-xs text-slate-500">
                  Created {new Date(proposal.created_at).toLocaleDateString()}
                </p>
                {proposal.valid_until && (
                  <p className="text-xs text-slate-500 flex items-center gap-1 justify-end mt-1">
                    <Clock className="w-3 h-3" /> Valid until {new Date(proposal.valid_until).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>

            {/* Title */}
            <div className="py-8">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Prepared for</p>
              <p className="text-lg font-bold text-slate-900 mb-4">{proposal.client_name}</p>
              <h1 className="text-3xl font-black text-slate-900">{proposal.title}</h1>
            </div>

            {/* Body */}
            <div className="prose-slate">{renderMarkdown(proposal.content)}</div>

            {/* Investment */}
            {proposal.items?.length > 0 && (
              <div className="mt-10">
                <h2 className="text-xl font-black text-slate-900 mb-4">Investment</h2>
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
                          <td className="p-4 text-right text-slate-900 font-bold">{money(Number(item.amount) || 0)}</td>
                        </tr>
                      ))}
                      <tr className="bg-emerald-50/30">
                        <td className="p-4 text-slate-900 font-bold">Total Investment</td>
                        <td className="p-4 text-right font-black text-xl" style={{ color: brand }}>
                          {money(Number(proposal.total) || 0)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Terms */}
            {proposal.terms && (
              <div className="mt-10 pt-8 border-t border-slate-100">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Terms</p>
                <p className="text-sm text-slate-600 leading-relaxed">{proposal.terms}</p>
              </div>
            )}

            <div className="mt-10 flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4" />
              Sent securely via RendaHQ
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProposalView;
