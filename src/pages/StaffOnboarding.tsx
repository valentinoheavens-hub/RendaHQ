"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Upload, 
  CheckCircle2, 
  ArrowRight, 
  User, 
  Briefcase, 
  Mail, 
  Sparkles,
  Camera
} from "lucide-react";
import { showSuccess } from "@/utils/toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const StaffOnboarding = () => {
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showSuccess("Profile created successfully! Welcome to the team.");
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <Card className="max-w-md w-full border-none shadow-2xl text-center p-8 rounded-[2.5rem]">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Welcome Aboard!</h2>
          <p className="text-slate-500 mb-8">
            Your profile has been created and added to the organization database. You can now access your dashboard.
          </p>
          <Button 
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-6 rounded-2xl font-bold" 
            onClick={() => navigate("/dashboard")}
          >
            Go to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 shadow-lg shadow-emerald-100">R</div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Staff Onboarding</h1>
          <p className="text-slate-500">Join the organization and set up your professional profile.</p>
        </div>

        <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden">
          <CardHeader className="bg-emerald-600 text-white p-8">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-100">New Member Setup</span>
            </div>
            <CardTitle className="text-2xl">Create Your Profile</CardTitle>
            <CardDescription className="text-emerald-100">This information will be visible to your team and clients.</CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Photo Upload Section */}
              <div className="flex flex-col items-center gap-4 pb-8 border-b border-slate-100">
                <div className="relative group">
                  <Avatar className="w-32 h-32 rounded-[2rem] border-4 border-slate-50 shadow-lg overflow-hidden">
                    <AvatarImage src={previewUrl || ""} className="object-cover" />
                    <AvatarFallback className="bg-slate-100">
                      <User className="w-12 h-12 text-slate-300" />
                    </AvatarFallback>
                  </Avatar>
                  <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-[2rem]">
                    <Camera className="w-8 h-8 text-white" />
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                  </label>
                </div>
                <div className="text-center">
                  <p className="font-bold text-slate-900">Profile Photo</p>
                  <p className="text-xs text-slate-500">Upload a professional headshot</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-slate-700 font-bold">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input placeholder="e.g. Jane Cooper" className="pl-10 rounded-xl border-slate-200 focus:ring-emerald-500" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-700 font-bold">Work Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input type="email" placeholder="jane@rendahq.com" className="pl-10 rounded-xl border-slate-200 focus:ring-emerald-500" required />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-slate-700 font-bold">Job Title</Label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input placeholder="e.g. Senior Designer" className="pl-10 rounded-xl border-slate-200 focus:ring-emerald-500" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-700 font-bold">Department</Label>
                  <select className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    <option>Design</option>
                    <option>Engineering</option>
                    <option>Product Management</option>
                    <option>Marketing</option>
                    <option>Operations</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700 font-bold">Professional Bio</Label>
                <Textarea 
                  placeholder="Tell us about your expertise and what you're passionate about..." 
                  className="min-h-[120px] rounded-xl border-slate-200 focus:ring-emerald-500" 
                />
              </div>

              <div className="pt-4">
                <Button 
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-7 text-lg rounded-2xl font-bold group shadow-xl shadow-emerald-100"
                >
                  Complete Onboarding
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <p className="text-center text-xs text-slate-400 mt-4">
                  By joining, you agree to the organization's internal policies and data guidelines.
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StaffOnboarding;