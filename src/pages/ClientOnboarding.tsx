import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, ArrowRight, Sparkles } from "lucide-react";

const ClientOnboarding = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <Card className="max-w-md w-full border-none shadow-xl text-center p-8">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Information Received!</h2>
          <p className="text-slate-500 mb-8">
            Thank you for completing the onboarding questionnaire. Felix has been notified and will reach out shortly with next steps.
          </p>
          <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => navigate("/")}>
            Return to Home
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 shadow-lg shadow-emerald-100">R</div>
          <h1 className="text-3xl font-bold text-slate-900">Welcome to RendaHQ</h1>
          <p className="text-slate-500">Let's get your project started with a few quick questions.</p>
        </div>

        <Card className="border-none shadow-sm">
          <CardHeader className="bg-emerald-600 text-white rounded-t-xl">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-100">Project Intake</span>
            </div>
            <CardTitle>Brand Identity Redesign</CardTitle>
            <CardDescription className="text-emerald-100">Onboarding for Acme Corp</CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-slate-700 font-bold">What is your company's legal name?</Label>
                <Input placeholder="e.g. Acme Corp LLC" className="bg-slate-50 border-slate-200 focus:ring-emerald-500" />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700 font-bold">Describe your project goals in detail.</Label>
                <Textarea 
                  placeholder="What are you hoping to achieve with this redesign?" 
                  className="min-h-[120px] bg-slate-50 border-slate-200 focus:ring-emerald-500" 
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700 font-bold">Who are your primary competitors?</Label>
                <Textarea 
                  placeholder="List 2-3 companies you admire or compete with." 
                  className="min-h-[80px] bg-slate-50 border-slate-200 focus:ring-emerald-500" 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-slate-700 font-bold">Target Launch Date</Label>
                  <Input type="date" className="bg-slate-50 border-slate-200 focus:ring-emerald-500" />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-700 font-bold">Estimated Budget Range</Label>
                  <select className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    <option>$1,000 - $5,000</option>
                    <option>$5,000 - $10,000</option>
                    <option>$10,000+</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100">
              <Button 
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-6 text-lg rounded-xl group"
                onClick={() => setIsSubmitted(true)}
              >
                Submit Onboarding Info
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <p className="text-center text-xs text-slate-400 mt-4">
                By submitting, you agree to our terms of service and privacy policy.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientOnboarding;