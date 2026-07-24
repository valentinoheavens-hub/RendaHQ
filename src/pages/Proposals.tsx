import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Plus,
  FileText,
  Clock,
  Loader2,
  Trash2,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { proposalStore, Proposal } from "@/lib/proposalStore";
import { useCurrency } from "@/hooks/useCurrency";
import { showError, showSuccess } from "@/utils/toast";

type Filter = "All" | "Draft" | "Sent" | "Accepted";

const Proposals = () => {
  const { format } = useCurrency();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("All");

  const load = () => {
    proposalStore.getAll()
      .then(setProposals)
      .catch(() => setProposals([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => proposals.filter((p) => {
    const matchesFilter = filter === "All" || p.status === filter;
    const q = query.toLowerCase();
    const matchesQuery = !q
      || p.title.toLowerCase().includes(q)
      || (p.client_name ?? "").toLowerCase().includes(q);
    return matchesFilter && matchesQuery;
  }), [proposals, filter, query]);

  const handleDelete = async (id: string) => {
    try {
      await proposalStore.remove(id);
      setProposals((prev) => prev.filter((p) => p.id !== id));
      showSuccess("Proposal deleted.");
    } catch (e: any) {
      showError(e.message || "Could not delete the proposal.");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Proposals</h1>
            <p className="text-slate-500">AI-assisted proposals, tailored from a discovery interview.</p>
          </div>
          <Link to="/proposal/new">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
              <Plus className="w-4 h-4" />
              New Proposal
            </Button>
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[220px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search proposals…"
              className="pl-10 bg-white border-slate-200"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {(["All", "Draft", "Sent", "Accepted"] as Filter[]).map((f) => (
              <Button
                key={f}
                variant={filter === f ? "outline" : "ghost"}
                className={cn(filter === f ? "border-slate-200" : "text-slate-500")}
                onClick={() => setFilter(f)}
              >
                {f}
              </Button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
            <Sparkles className="w-10 h-10 text-emerald-200 mx-auto mb-3" />
            <p className="text-slate-600 font-medium">
              {proposals.length === 0 ? "No proposals yet" : "No proposals match your filters"}
            </p>
            <p className="text-slate-400 text-sm mt-1 mb-6">
              {proposals.length === 0
                ? "The AI will interview you about the project, then draft a proposal you can edit."
                : "Try a different search or filter."}
            </p>
            {proposals.length === 0 && (
              <Link to="/proposal/new">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
                  <Plus className="w-4 h-4" /> Create your first proposal
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filtered.map((prop) => (
              <Card key={prop.id} className="border-none shadow-sm hover:shadow-md transition-all group">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <Link to={`/proposal/view/${prop.id}`} className="flex items-center gap-4 min-w-[250px]">
                      <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors truncate">
                          {prop.title}
                        </h3>
                        <p className="text-sm text-slate-500 truncate">{prop.client_name || "No client"}</p>
                      </div>
                    </Link>

                    <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-6">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
                        <Badge className={cn(
                          "border-none",
                          prop.status === "Accepted" ? "bg-emerald-50 text-emerald-700" :
                          prop.status === "Sent" ? "bg-blue-50 text-blue-700" :
                          prop.status === "Declined" ? "bg-rose-50 text-rose-700" :
                          "bg-slate-100 text-slate-600"
                        )}>
                          {prop.status}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Created</p>
                        <div className="flex items-center gap-1.5 text-sm text-slate-600">
                          <Clock className="w-3.5 h-3.5" />
                          {new Date(prop.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Value</p>
                        <p className="font-bold text-slate-900">{format(Number(prop.total) || 0)}</p>
                      </div>
                    </div>

                    <Button
                      variant="ghost" size="icon"
                      className="text-slate-400 hover:text-rose-500 shrink-0"
                      onClick={() => handleDelete(prop.id)}
                      aria-label="Delete proposal"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Proposals;
