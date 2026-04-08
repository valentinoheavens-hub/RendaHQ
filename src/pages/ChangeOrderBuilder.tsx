import React, { useState } from "react";
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
  AlertTriangle,
  DollarSign,
  Clock
} from "lucide-react";

const ChangeOrderBuilder = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">New Change Order</h1>
              <p className="text-slate-500">Documenting a scope adjustment for Brand Identity Redesign.</p>
            </div>
          </div>
          <Button className="bg-amber-600 hover:bg-amber-700 text-white gap-2">
            <Send className="w-4 h-4" /> Send to Client
          </Button>
        </div>

        <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex gap-4">
          <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
          <div>
            <p className="text-sm font-bold text-amber-900">Formal Scope Adjustment</p>
            <p className="text-sm text-amber-700">
              This document will be sent to the client for approval. Once signed, it becomes a legally binding addendum to your original contract.
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
              <Input placeholder="e.g. Additional Social Media Assets" />
            </div>
            <div className="space-y-2">
              <Label>Description of Change</Label>
              <Textarea 
                placeholder="What specific work is being added that was not in the original scope?" 
                className="min-h-[120px]"
              />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Additional Cost</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input className="pl-10" placeholder="0.00" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Timeline Impact</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input className="pl-10" placeholder="e.g. +1 week" />
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
              defaultValue="Hi John, as discussed, adding the social media kit requires some extra design time. I've drafted this change order to keep our records clear."
              className="min-h-[100px]"
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ChangeOrderBuilder;