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
import { generateContract } from "@/lib/ai";
import { contractStore, Contract } from "@/lib/contractStore";

const Contracts = () => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [description, setDescription] = useState("");
  const [serviceType, setServiceType] = useState("Design Services");
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loadingContracts, setLoadingContracts] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const hasApiKey = Boolean(import.meta.env.VITE_GROQ_API_KEY);

  useEffect(() => {
    contractStore.getAll()
      .then(setContracts)
      .catch(() => setContracts([]))
      .finally(() => setLoadingContracts(false));
  }, []);

  const filteredContracts = contracts.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.client.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleGenerate = async () => {
    if (!description.trim()) return;
    if (!hasApiKey) {
      showError("RendaHQ AI is not configured. Please check your environment setup.");
      return;
    }

    setIsGenerating(true);
    try {
      const aiContent = await generateContract(description, serviceType);
      const title = `${serviceType} — ${new Date().toLocaleDateString()}`;

      const contract = await contractStore.create({
        title,
        client: "New Client",
        status: "Draft",
        content: aiContent,
        service_type: serviceType,
        value: "$0.00",
      });

      showSuccess("Contract drafted by RendaHQ AI!");
      navigate(`/contract/edit/${contract.id}`);
    } catch (err: any) {
      showError(err.message || "Failed to generate contract. Please try again.");
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
            <p className="text-slate-500">Manage agreements and generate new ones with RendaHQ AI.</p>
          </div>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
            <Plus className="w-4 h-4" />
            New Contract
          </Button>
        </div>

        {!hasApiKey && (
          <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex gap-3 items-center">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            <p className="text-sm text-amber-800">
              <strong>RendaHQ AI is not configured.</strong> Please contact support or check your environment setup to enable AI generation.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* AI Builder Panel */}
          <Card className="lg:col-span-1 border-none shadow-sm bg-emerald-50 border-emerald-100 relative overflow-hidden">
            <CardHeader>
              <div className="flex items-center gap-2 text-emerald-600 mb-1">
                <Sparkles className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider">AI Contract Builder</span>
              </div>
              <CardTitle className="text-lg font-bold">Generate with RendaHQ AI</CardTitle>
              <CardDescription>
                Describe your project scope and RendaHQ AI will draft a professional contract.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 relative z-10">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Project Description</label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. I'm designing a 5-page website for a law firm, including logo and brand guidelines..."
                  className="min-h-[150px] bg-white border-slate-200 focus:ring-emerald-500 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Service Type</label>
                <select
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option>Design Services</option>
                  <option>Software Development</option>
                  <option>Consulting</option>
                  <option>Marketing & Strategy</option>
                  <option>Content Creation</option>
                  <option>Photography & Video</option>
                </select>
              </div>
              <Button
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-6 rounded-xl font-bold group"
                onClick={handleGenerate}
                disabled={isGenerating || !description.trim() || !hasApiKey}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    RendaHQ AI is Drafting...
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

          {/* Contract List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search contracts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white border-slate-200 rounded-xl"
                />
              </div>
            </div>

            {filteredContracts.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200">
                <Sparkles className="w-10 h-10 text-emerald-200 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">No contracts yet</p>
                <p className="text-slate-400 text-sm mt-1">
                  {searchQuery ? "No results for that search." : "Describe your project and let RendaHQ AI draft your first contract."}
                </p>
              </div>
            ) : (
              filteredContracts.map((contract) => (
                <Card
                  key={contract.id}
                  className="border-none shadow-sm hover:shadow-md transition-shadow rounded-2xl overflow-hidden cursor-pointer"
                  onClick={() => navigate(`/contract/edit/${contract.id}`)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center",
                          contract.status === "Signed" ? "bg-emerald-50 text-emerald-600" :
                          contract.status === "Sent" ? "bg-amber-50 text-amber-600" :
                          contract.status === "Cancelled" ? "bg-red-50 text-red-600" :
                          "bg-blue-50 text-blue-600"
                        )}>
                          <FileText className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900">{contract.title}</h4>
                          <p className="text-sm text-slate-500">
                            {contract.client} · {new Date(contract.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right hidden sm:block">
                          <p className="font-bold text-slate-900">{contract.value}</p>
                          <Badge className={cn(
                            "border-none",
                            contract.status === "Signed" ? "bg-emerald-50 text-emerald-700" :
                            contract.status === "Sent" ? "bg-amber-50 text-amber-700" :
                            contract.status === "Cancelled" ? "bg-red-50 text-red-700" :
                            "bg-blue-50 text-blue-700"
                          )}>
                            {contract.status}
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-slate-400"
                          onClick={(e) => e.stopPropagation()}
                        >
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
