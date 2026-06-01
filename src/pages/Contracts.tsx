"use client";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Sparkles, 
  FileText, 
  Search, 
  Plus, 
  MoreVertical,
  ArrowRight,
  Loader2,
  AlertCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { showSuccess, showError } from "@/utils/toast";
import { supabase } from "@/lib/supabase";
import { generateContract } from "@/lib/ai";

const Contracts = () => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [description, setDescription] = useState("");
  const [serviceType, setServiceType] = useState("Design Services");
  const [contracts, setContracts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const hasApiKey = Boolean(import.meta.env.VITE_GROQ_API_KEY);

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    try {
      const { data, error } = await supabase
        .from('contracts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setContracts(data || []);
    } catch (err) {
      console.error("Error fetching contracts:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!description) return;
    if (!hasApiKey) {
      showError("NexWork AI is not configured. Please check your environment setup.");
      return;
    }

    setIsGenerating(true);
    
    try {
      const aiContent = await generateContract(description, serviceType);
      const title = `${serviceType} - ${new Date().toLocaleDateString()}`;

      const { data, error } = await supabase
        .from('contracts')
        .insert([
          { 
            title, 
            client: "New Client", 
            status: "Draft", 
            content: aiContent,
            service_type: serviceType,
            value: "$0.00"
          }
        ])
        .select();

      if (error) throw error;

      showSuccess("AI Contract Generated!");
      navigate(`/contract/edit/${data[0].id}`);
    } catch (err: any) {
      showError(err.message || "Failed to generate contract.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Contracts</h1>
            <p className="text-slate-500">Manage agreements and generate new ones with NexWork AI.</p>
          </div>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
            <Plus className="w-4 h-4" />
            New Contract
          </Button>
        </div>

        {!hasApiKey && (
          <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex gap-3 items-center">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            <p className="text-sm text-amber-800">
              <strong>NexWork AI is not configured.</strong> Please contact support or check your environment setup to enable AI generation.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-1 border-none shadow-sm bg-indigo-50 border-indigo-100 relative overflow-hidden">
            <CardHeader>
              <div className="flex items-center gap-2 text-indigo-600 mb-1">
                <Sparkles className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider">AI Contract Builder</span>
              </div>
              <CardTitle className="text-lg font-bold">Generate with NexWork AI</CardTitle>
              <CardDescription>
                Describe your project scope and NexWork AI will draft a professional contract.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 relative z-10">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Project Description</label>
                <Textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. I'm designing a 5-page website for a law firm..."
                  className="min-h-[150px] bg-white border-slate-200 focus:ring-indigo-500 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Service Type</label>
                <select 
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option>Design Services</option>
                  <option>Software Development</option>
                  <option>Consulting</option>
                </select>
              </div>
              <Button 
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-6 rounded-xl font-bold group"
                onClick={handleGenerate}
                disabled={isGenerating || !description || !hasApiKey}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    NexWork AI is Drafting...
                  </>
                ) : (
                  <>
                    Generate Contract Draft
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input placeholder="Search contracts..." className="pl-10 bg-white border-slate-200 rounded-xl" />
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-12"><Loader2 className="animate-spin text-indigo-600" /></div>
            ) : contracts.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
                <p className="text-slate-400">No contracts found. Generate your first one!</p>
              </div>
            ) : (
              contracts.map((contract) => (
                <Card key={contract.id} className="border-none shadow-sm hover:shadow-md transition-shadow rounded-2xl overflow-hidden cursor-pointer" onClick={() => navigate(`/contract/edit/${contract.id}`)}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center",
                          contract.status === "Signed" ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"
                        )}>
                          <FileText className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900">{contract.title}</h4>
                          <p className="text-sm text-slate-500">{contract.client} • {new Date(contract.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right hidden sm:block">
                          <p className="font-bold text-slate-900">{contract.value}</p>
                          <Badge className={cn(
                            "border-none",
                            contract.status === "Signed" ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-blue-700"
                          )}>
                            {contract.status}
                          </Badge>
                        </div>
                        <Button variant="ghost" size="icon" className="text-slate-400">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Contracts;