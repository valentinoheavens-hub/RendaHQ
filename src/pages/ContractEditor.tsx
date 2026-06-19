"use client";

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  Save,
  Send,
  Bold,
  Italic,
  List,
  Type,
  Loader2,
  Sparkles,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { showSuccess, showError } from "@/utils/toast";
import { suggestClause } from "@/lib/ai";
import { contractStore } from "@/lib/contractStore";
import { sendContractForSigning } from "@/lib/email";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const ContractEditor = () => {
  const navigate = useNavigate();
  const { contractId } = useParams();
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("Loading...");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [showSendDialog, setShowSendDialog] = useState(false);
  const [sendEmail, setSendEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const hasApiKey = Boolean(import.meta.env.VITE_GROQ_API_KEY);

  useEffect(() => {
    if (!contractId) return;
    contractStore.getById(contractId).then((contract) => {
      if (!contract) {
        showError("Contract not found.");
        navigate("/contracts");
        return;
      }
      setContent(contract.content || "");
      setTitle(contract.title);
      setLoading(false);
    });
  }, [contractId]);

  const handleSave = async () => {
    if (!contractId) return;
    setSaving(true);
    try {
      await contractStore.update(contractId, { content });
      showSuccess("Contract saved!");
    } catch {
      showError("Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  const handleSendToClient = async () => {
    if (!sendEmail) return;
    setIsSending(true);
    const result = await sendContractForSigning({
      clientEmail: sendEmail,
      clientName: sendEmail.split("@")[0],
      contractTitle: title,
      message: `Please review and sign the contract: "${title}". You can find the full document below.`,
    });
    setIsSending(false);
    if (result.success) {
      showSuccess("Contract sent to " + sendEmail + "!");
      setShowSendDialog(false);
      setSendEmail("");
    } else {
      showError(result.error || "Failed to send contract.");
    }
  };

  const handleAISuggestion = async () => {
    if (!hasApiKey) {
      showError("RendaHQ AI is not configured. Please contact support.");
      return;
    }
    setIsSuggesting(true);
    try {
      const suggestion = await suggestClause(content, "Intellectual Property");
      setContent((prev) => prev + "\n\n" + suggestion);
      showSuccess("Clause added by RendaHQ AI!");
    } catch {
      showError("AI suggestion failed. Please try again.");
    } finally {
      setIsSuggesting(false);
    }
  };

  if (loading)
    return (
      <DashboardLayout>
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-emerald-600 w-8 h-8" />
        </div>
      </DashboardLayout>
    );

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/contracts")}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
              <p className="text-slate-500">Editing Contract Draft</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2" onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Draft
            </Button>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
              onClick={() => setShowSendDialog(true)}
            >
              <Send className="w-4 h-4" /> Send to Client
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Editor */}
          <div className="lg:col-span-3">
            <Card className="border-none shadow-sm min-h-[800px]">
              <div className="border-b border-slate-100 p-2 flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8"><Bold className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8"><Italic className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8"><List className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8"><Type className="w-4 h-4" /></Button>
              </div>
              <CardContent className="p-8">
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[700px] border-none focus-visible:ring-0 text-lg leading-relaxed font-serif resize-none"
                  placeholder="Your contract content will appear here..."
                />
              </CardContent>
            </Card>
          </div>

          {/* AI Sidebar */}
          <div className="space-y-6">
            <Card className="border-none shadow-sm bg-emerald-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 text-emerald-600 mb-2">
                  <Sparkles className="w-4 h-4" />
                  <h4 className="font-bold">RendaHQ AI Assistant</h4>
                </div>
                <p className="text-sm text-emerald-700 mb-4">
                  RendaHQ AI can help you refine this contract. Click below to add a standard "Intellectual Property" clause.
                </p>
                <Button
                  className="w-full bg-emerald-600 text-white hover:bg-emerald-700 border-none"
                  onClick={handleAISuggestion}
                  disabled={isSuggesting || !hasApiKey}
                >
                  {isSuggesting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Add Clause with RendaHQ AI"
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Contract Tips */}
            <Card className="border-none shadow-sm">
              <CardContent className="p-6 space-y-3">
                <h4 className="font-bold text-slate-900 text-sm">Quick Tips</h4>
                {[
                  "Always specify payment milestones clearly",
                  "Include a revision limit clause",
                  "Define project completion criteria",
                  "Add a late payment penalty clause",
                ].map((tip, i) => (
                  <p key={i} className="text-xs text-slate-500 flex gap-2">
                    <span className="text-emerald-400 font-bold shrink-0">→</span>
                    {tip}
                  </p>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Send to Client Dialog */}
      <Dialog open={showSendDialog} onOpenChange={setShowSendDialog}>
        <DialogContent className="sm:max-w-[440px] rounded-3xl border-none shadow-2xl">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center">
                <Send className="w-4 h-4 text-emerald-600" />
              </div>
              <DialogTitle className="text-lg font-bold">Send Contract to Client</DialogTitle>
            </div>
            <DialogDescription>
              Enter the client's email address. They'll receive the contract <strong>{title}</strong> for review and signing.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Client Email</label>
              <Input
                type="email"
                placeholder="client@example.com"
                value={sendEmail}
                onChange={(e) => setSendEmail(e.target.value)}
                className="h-10 border-slate-200 focus-visible:ring-emerald-500"
                onKeyDown={(e) => e.key === "Enter" && handleSendToClient()}
              />
            </div>
            <div className="flex gap-3 pt-1">
              <Button variant="outline" className="flex-1" onClick={() => setShowSendDialog(false)}>
                Cancel
              </Button>
              <Button
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
                onClick={handleSendToClient}
                disabled={!sendEmail || isSending}
              >
                {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {isSending ? "Sending…" : "Send"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default ContractEditor;
