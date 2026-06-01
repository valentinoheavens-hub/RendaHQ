"use client";

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  Save, 
  Send, 
  Download, 
  Eye,
  Bold,
  Italic,
  List,
  Type,
  Loader2,
  Sparkles
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";
import { showSuccess, showError } from "@/utils/toast";
import { suggestClause } from "@/lib/ai";

const ContractEditor = () => {
  const navigate = useNavigate();
  const { contractId } = useParams();
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("Loading...");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const hasApiKey = Boolean(import.meta.env.VITE_GROQ_API_KEY);

  useEffect(() => {
    if (contractId) fetchContract();
  }, [contractId]);

  const fetchContract = async () => {
    try {
      const { data, error } = await supabase
        .from('contracts')
        .select('*')
        .eq('id', contractId)
        .single();
      
      if (error) throw error;
      setContent(data.content || "");
      setTitle(data.title);
    } catch (err) {
      showError("Could not load contract.");
      navigate("/contracts");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('contracts')
        .update({ content })
        .eq('id', contractId);
      
      if (error) throw error;
      showSuccess("Contract saved successfully!");
    } catch (err) {
      showError("Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  const handleAISuggestion = async () => {
    if (!hasApiKey) {
      showError("NexWork AI is not configured. Please contact support.");
      return;
    }
    setIsSuggesting(true);
    try {
      const suggestion = await suggestClause(content, "Intellectual Property");
      setContent(prev => prev + "\n\n" + suggestion);
      showSuccess("Clause added by NexWork AI!");
    } catch (err) {
      showError("AI suggestion failed.");
    } finally {
      setIsSuggesting(false);
    }
  };

  if (loading) return <DashboardLayout><div className="flex justify-center py-20"><Loader2 className="animate-spin" /></div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="space-y-8">
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
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
              <Send className="w-4 h-4" /> Send to Client
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
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
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-none shadow-sm bg-indigo-50 border-indigo-100">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 text-indigo-600 mb-2">
                  <Sparkles className="w-4 h-4" />
                  <h4 className="font-bold">NexWork AI Assistant</h4>
                </div>
                <p className="text-sm text-indigo-700 mb-4">
                  NexWork AI can help you refine this contract. Click below to add a standard "Intellectual Property" clause.
                </p>
                <Button 
                  className="w-full bg-indigo-600 text-white hover:bg-indigo-700 border-none"
                  onClick={handleAISuggestion}
                  disabled={isSuggesting || !hasApiKey}
                >
                  {isSuggesting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add Clause with NexWork AI"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ContractEditor;