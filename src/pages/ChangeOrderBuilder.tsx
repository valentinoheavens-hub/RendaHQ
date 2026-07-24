import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ChevronLeft,
  Send,
  Save,
  AlertTriangle,
  DollarSign,
  Clock,
  Loader2,
} from "lucide-react";
import { projectStore } from "@/lib/projectStore";
import { changeOrderStore } from "@/lib/changeOrderStore";
import { usePlan } from "@/context/SubscriptionContext";
import UpgradeBanner from "@/components/UpgradeBanner";
import { showSuccess, showError } from "@/utils/toast";

const ChangeOrderBuilder = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const { can, isFree } = usePlan();
  const canChangeOrders = can.changeOrders;

  const [projectName, setProjectName] = useState("");
  const [clientName, setClientName] = useState("");
  const [loadingProject, setLoadingProject] = useState(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [timeline, setTimeline] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState<null | "draft" | "send">(null);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!projectId) { setLoadingProject(false); return; }
      const p = await projectStore.getById(projectId);
      if (!active) return;
      if (p) {
        setProjectName(p.name);
        setClientName(p.client_name ?? "");
        setMessage(
          `Hi ${p.client_name || "there"}, as discussed, this work falls outside our original scope. ` +
          `I've drafted this change order so our records stay clear and we're aligned before I start.`
        );
      }
      setLoadingProject(false);
    })();
    return () => { active = false; };
  }, [projectId]);

  const persist = async (status: "Draft" | "Sent") => {
    if (!canChangeOrders) {
      showError("Scope change orders are on the Agency plan. Upgrade to send them.");
      navigate("/billing");
      return;
    }
    if (!title.trim()) { showError("Give the change order a title."); return; }

    setSaving(status === "Draft" ? "draft" : "send");
    try {
      await changeOrderStore.create({
        project_id: projectId ?? null,
        project_name: projectName,
        client_name: clientName,
        title: title.trim(),
        description: description.trim(),
        amount: parseFloat(amount) || 0,
        timeline_impact: timeline.trim(),
        client_message: message.trim(),
        status,
      });
      showSuccess(status === "Sent" ? "Change order sent to the client." : "Change order saved as a draft.");
      navigate(projectId ? `/project/${projectId}` : "/projects");
    } catch (e) {
      showError((e as Error)?.message ?? "Could not save the change order.");
      setSaving(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div className="min-w-0">
              <h1 className="text-2xl font-bold text-slate-900">New Change Order</h1>
              <p className="text-slate-500 truncate">
                {loadingProject
                  ? "Loading project…"
                  : projectName
                  ? `Documenting a scope adjustment for ${projectName}.`
                  : "Documenting a scope adjustment."}
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              className="gap-2 border-slate-200"
              onClick={() => persist("Draft")}
              disabled={!canChangeOrders || saving !== null}
            >
              {saving === "draft" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Draft
            </Button>
            <Button
              className="bg-amber-600 hover:bg-amber-700 text-white gap-2"
              onClick={() => persist("Send")}
              disabled={!canChangeOrders || saving !== null}
            >
              {saving === "send" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Send to Client
            </Button>
          </div>
        </div>

        {isFree && !canChangeOrders && (
          <UpgradeBanner
            title="Scope change orders are an Agency feature"
            message="Formal, client-signed change orders that make extra work billable are included on the Agency plan. Upgrade to send them."
          />
        )}

        <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex gap-4">
          <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
          <div>
            <p className="text-sm font-bold text-amber-900">Formal Scope Adjustment</p>
            <p className="text-sm text-amber-700">
              This document is sent to the client for approval. Once approved, it becomes an addendum to your
              original contract — so extra work is billed, not absorbed.
            </p>
          </div>
        </div>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle>Change Details</CardTitle>
            <CardDescription>Clearly define what is being added to the project scope.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Change Order Title</Label>
              <Input
                placeholder="e.g. Additional Social Media Assets"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={!canChangeOrders}
              />
            </div>
            <div className="space-y-2">
              <Label>Description of Change</Label>
              <Textarea
                placeholder="What specific work is being added that was not in the original scope?"
                className="min-h-[120px]"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={!canChangeOrders}
              />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Additional Cost</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    className="pl-10"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    disabled={!canChangeOrders}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Timeline Impact</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    className="pl-10"
                    placeholder="e.g. +1 week"
                    value={timeline}
                    onChange={(e) => setTimeline(e.target.value)}
                    disabled={!canChangeOrders}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle>Client Message</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Add a friendly note explaining why this change order is necessary..."
              className="min-h-[100px]"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={!canChangeOrders}
            />
          </CardContent>
        </Card>

        {/* Mobile action bar */}
        <div className="flex sm:hidden items-center gap-2">
          <Button
            variant="outline"
            className="flex-1 gap-2 border-slate-200"
            onClick={() => persist("Draft")}
            disabled={!canChangeOrders || saving !== null}
          >
            {saving === "draft" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Draft
          </Button>
          <Button
            className="flex-1 bg-amber-600 hover:bg-amber-700 text-white gap-2"
            onClick={() => persist("Send")}
            disabled={!canChangeOrders || saving !== null}
          >
            {saving === "send" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Send to Client
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ChangeOrderBuilder;
