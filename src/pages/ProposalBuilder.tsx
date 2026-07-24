import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ChevronLeft,
  Plus,
  Trash2,
  Sparkles,
  Loader2,
  ArrowRight,
  RefreshCw,
  Save,
  MessageSquareText,
  PencilLine,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { showError, showSuccess } from "@/utils/toast";
import { useCurrency } from "@/hooks/useCurrency";
import { useAuth } from "@/context/AuthContext";
import { clientStore, Client } from "@/lib/clientStore";
import { proposalStore, ProposalItem } from "@/lib/proposalStore";
import { generateProposalQuestions, generateProposalContent } from "@/lib/ai";

type Step = "brief" | "interview" | "edit";

const PROJECT_TYPES = [
  "Web Design / Development",
  "Branding & Identity",
  "UI/UX Design",
  "Marketing & Strategy",
  "Content Creation",
  "Consulting",
  "Other",
];

const ProposalBuilder = () => {
  const navigate = useNavigate();
  const { format, code: currencyCode } = useCurrency();
  const { profile } = useAuth();

  const [step, setStep] = useState<Step>("brief");
  const [busy, setBusy] = useState(false);
  const [saving, setSaving] = useState(false);

  // Brief
  const [clients, setClients] = useState<Client[]>([]);
  const [clientId, setClientId] = useState<string>("");
  const [clientName, setClientName] = useState("");
  const [title, setTitle] = useState("");
  const [projectType, setProjectType] = useState(PROJECT_TYPES[0]);
  const [scope, setScope] = useState("");
  const [budget, setBudget] = useState("");
  const [validUntil, setValidUntil] = useState("");
  const [terms, setTerms] = useState("50% upfront deposit required. 2 rounds of revisions included.");

  // Interview
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);

  // Editable output
  const [content, setContent] = useState("");
  const [items, setItems] = useState<ProposalItem[]>([{ id: 1, description: "", amount: 0 }]);

  useEffect(() => {
    clientStore.getAll().then(setClients).catch(() => setClients([]));
  }, []);

  const total = useMemo(() => items.reduce((acc, i) => acc + (Number(i.amount) || 0), 0), [items]);

  const selectClient = (id: string) => {
    setClientId(id);
    const c = clients.find((x) => x.id === id);
    if (c) setClientName(c.name);
  };

  // Step 1 → 2: AI generates the discovery questions from the brief.
  const startInterview = async () => {
    if (!title.trim()) { showError("Give the proposal a title first."); return; }
    if (!clientName.trim()) { showError("Choose or enter a client."); return; }
    if (!scope.trim()) { showError("Describe the scope — even rough notes help the AI ask better questions."); return; }
    setBusy(true);
    try {
      const qs = await generateProposalQuestions({
        projectTitle: title,
        clientName,
        scopeSummary: scope,
        projectType,
      });
      setQuestions(qs);
      setAnswers(qs.map(() => ""));
      setStep("interview");
    } catch (e: any) {
      showError(e.message || "Could not generate questions. Try again.");
    } finally {
      setBusy(false);
    }
  };

  // Step 2 → 3: AI writes the proposal from brief + answers; output is editable.
  const generateDraft = async () => {
    const answered = answers.filter((a) => a.trim()).length;
    if (answered === 0) {
      showError("Answer at least one question — that's what makes the proposal tailored.");
      return;
    }
    setBusy(true);
    try {
      const draft = await generateProposalContent({
        projectTitle: title,
        clientName,
        scopeSummary: scope,
        budget: budget || undefined,
        projectType,
        agencyName: profile?.agency_name ?? undefined,
        answers: questions.map((q, i) => ({ question: q, answer: answers[i] ?? "" })),
      });
      setContent(draft);
      setStep("edit");
    } catch (e: any) {
      showError(e.message || "Could not generate the proposal. Try again.");
    } finally {
      setBusy(false);
    }
  };

  const saveProposal = async (status: "Draft" | "Sent") => {
    if (!content.trim()) { showError("The proposal is empty."); return; }
    setSaving(true);
    try {
      const cleanItems = items.filter((i) => i.description.trim() || i.amount > 0);
      const proposal = await proposalStore.create({
        client_id: clientId || null,
        title,
        client_name: clientName,
        status,
        content,
        items: cleanItems,
        total,
        currency_code: currencyCode,
        valid_until: validUntil || null,
        terms,
        brief: {
          projectType,
          scope,
          budget,
          questions: questions.map((q, i) => ({ question: q, answer: answers[i] ?? "" })),
        },
      });
      showSuccess(status === "Draft" ? "Proposal saved as draft." : "Proposal saved and marked as sent.");
      navigate(`/proposal/view/${proposal.id}`);
    } catch (e: any) {
      showError(e.message || "Failed to save the proposal.");
    } finally {
      setSaving(false);
    }
  };

  const stepIndex = step === "brief" ? 0 : step === "interview" ? 1 : 2;

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/proposals")}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Create Proposal</h1>
            <p className="text-slate-500">AI interviews you first, then drafts a proposal you can edit.</p>
          </div>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2">
          {[
            { label: "1. Brief", icon: PencilLine },
            { label: "2. AI Interview", icon: MessageSquareText },
            { label: "3. Review & Edit", icon: Sparkles },
          ].map((s, i) => (
            <React.Fragment key={s.label}>
              {i > 0 && <div className={cn("h-px flex-1", i <= stepIndex ? "bg-emerald-400" : "bg-slate-200")} />}
              <div className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold",
                i === stepIndex ? "bg-emerald-600 text-white" :
                i < stepIndex ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-400"
              )}>
                <s.icon className="w-3.5 h-3.5" />
                {s.label}
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* ── Step 1: Brief ── */}
        {step === "brief" && (
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>Project Brief</CardTitle>
              <CardDescription>Rough notes are fine — the AI asks the sharp questions next.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Proposal Title *</Label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Website Redesign & Branding" />
                </div>
                <div className="space-y-2">
                  <Label>Type of Work</Label>
                  <select
                    value={projectType}
                    onChange={(e) => setProjectType(e.target.value)}
                    className="w-full h-10 rounded-md border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {PROJECT_TYPES.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Client *</Label>
                  {clients.length > 0 ? (
                    <select
                      value={clientId}
                      onChange={(e) => selectClient(e.target.value)}
                      className="w-full h-10 rounded-md border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="">— Select a client —</option>
                      {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  ) : (
                    <Input value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="Client name" />
                  )}
                  {clients.length > 0 && !clientId && (
                    <Input value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="…or type a new client name" />
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Budget Context (optional)</Label>
                  <Input value={budget} onChange={(e) => setBudget(e.target.value)} placeholder={`e.g. ${format(5000)} – ${format(8000)}`} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Scope Notes *</Label>
                <Textarea
                  value={scope}
                  onChange={(e) => setScope(e.target.value)}
                  placeholder="What does the client want? Goals, deliverables, anything you already know…"
                  className="min-h-[140px]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Valid Until</Label>
                  <Input type="date" value={validUntil} onChange={(e) => setValidUntil(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Terms & Conditions</Label>
                  <Input value={terms} onChange={(e) => setTerms(e.target.value)} />
                </div>
              </div>

              <Button
                className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 h-11"
                onClick={startInterview}
                disabled={busy}
              >
                {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageSquareText className="w-4 h-4" />}
                {busy ? "Preparing questions…" : "Continue — let AI interview me"}
                {!busy && <ArrowRight className="w-4 h-4" />}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* ── Step 2: AI Interview ── */}
        {step === "interview" && (
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                Discovery Interview
              </CardTitle>
              <CardDescription>
                The AI generated these questions from your brief. The more you answer, the sharper the proposal — skip any that don't apply.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {questions.map((q, i) => (
                <div key={i} className="space-y-1.5">
                  <Label className="text-slate-800 leading-snug">{i + 1}. {q}</Label>
                  <Textarea
                    value={answers[i] ?? ""}
                    onChange={(e) => setAnswers((prev) => prev.map((a, j) => (j === i ? e.target.value : a)))}
                    placeholder="Your answer (optional)…"
                    className="min-h-[64px]"
                  />
                </div>
              ))}
              <div className="flex flex-wrap gap-3 pt-2">
                <Button variant="outline" onClick={() => setStep("brief")} disabled={busy}>
                  <ChevronLeft className="w-4 h-4 mr-1" /> Back to brief
                </Button>
                <Button
                  className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
                  onClick={generateDraft}
                  disabled={busy}
                >
                  {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  {busy ? "Writing your proposal…" : "Generate tailored proposal"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ── Step 3: Review & Edit ── */}
        {step === "edit" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-none shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Proposal Content</CardTitle>
                    <CardDescription>Fully editable — refine anything before saving.</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2 shrink-0" onClick={generateDraft} disabled={busy}>
                    {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                    Regenerate
                  </Button>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[480px] font-mono text-sm leading-relaxed"
                  />
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle>Investment Breakdown</CardTitle>
                  <CardDescription>Line items shown to the client alongside the proposal.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3 items-center">
                      <Input
                        value={item.description}
                        onChange={(e) => setItems((prev) => prev.map((x) => x.id === item.id ? { ...x, description: e.target.value } : x))}
                        placeholder="e.g. Discovery & Research"
                        className="flex-1 bg-slate-50 border-none"
                      />
                      <Input
                        type="number"
                        value={item.amount || ""}
                        onChange={(e) => setItems((prev) => prev.map((x) => x.id === item.id ? { ...x, amount: Number(e.target.value) || 0 } : x))}
                        placeholder="0"
                        className="w-36 bg-slate-50 border-none text-right"
                      />
                      <Button
                        variant="ghost" size="icon" className="text-slate-400 hover:text-rose-500 shrink-0"
                        onClick={() => setItems((prev) => prev.filter((x) => x.id !== item.id))}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="ghost"
                    className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                    onClick={() => setItems((prev) => [...prev, { id: Date.now(), description: "", amount: 0 }])}
                  >
                    <Plus className="w-4 h-4 mr-2" /> Add Line Item
                  </Button>
                  <div className="flex justify-end pt-4 border-t border-slate-100">
                    <div className="w-64 flex justify-between items-center">
                      <span className="font-bold text-slate-900">Total Investment</span>
                      <span className="text-2xl font-black text-emerald-600">{format(total)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-400">Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-slate-500">Client</span><span className="font-bold text-slate-900">{clientName}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Type</span><span className="font-medium text-slate-700">{projectType}</span></div>
                  {validUntil && <div className="flex justify-between"><span className="text-slate-500">Valid until</span><span className="font-medium text-slate-700">{validUntil}</span></div>}
                  <div className="flex justify-between"><span className="text-slate-500">Questions answered</span><span className="font-medium text-slate-700">{answers.filter((a) => a.trim()).length}/{questions.length}</span></div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm">
                <CardContent className="p-6 space-y-3">
                  <Button
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-2 h-11"
                    onClick={() => saveProposal("Draft")}
                    disabled={saving}
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save as Draft
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full gap-2 h-11"
                    onClick={() => saveProposal("Sent")}
                    disabled={saving}
                  >
                    Save & mark as Sent
                  </Button>
                  <Button variant="ghost" className="w-full text-slate-500" onClick={() => setStep("interview")} disabled={saving || busy}>
                    <ChevronLeft className="w-4 h-4 mr-1" /> Back to interview
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ProposalBuilder;
