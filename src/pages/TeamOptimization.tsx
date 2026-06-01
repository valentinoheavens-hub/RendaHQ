"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Users, 
  Target, 
  HeartPulse, 
  Briefcase, 
  Zap, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2,
  MoreHorizontal,
  Plus,
  Compass,
  Activity,
  Trophy,
  Star,
  Calendar,
  UserPlus,
  ArrowUpRight,
  Sparkles,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { generateVitalityInsight } from "@/lib/ai";
import { showError } from "@/utils/toast";

const TeamOptimization = () => {
  const [vitalityInsight, setVitalityInsight] = useState("");
  const [isLoadingVitality, setIsLoadingVitality] = useState(false);

  const handleVitalityAlert = async () => {
    setIsLoadingVitality(true);
    try {
      const context = team.map(m =>
        `${m.name} (${m.role}): Alignment ${m.alignment}%, Engagement ${m.engagement}%, Vitality ${m.vitality}%, Burnout Risk: ${m.burnoutRisk}, Current Focus: ${m.currentFocus}, Tenure: ${m.tenure}`
      ).join('\n');
      const result = await generateVitalityInsight(context);
      setVitalityInsight(result);
    } catch (err: any) {
      showError(err.message || "Failed to generate vitality insight.");
    } finally {
      setIsLoadingVitality(false);
    }
  };

  const team = [
    {
      id: 1,
      name: "Sarah Chen",
      role: "Senior UI/UX Designer",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200",
      alignment: 92,
      engagement: 88,
      vitality: 75,
      status: "Peak Performance",
      currentFocus: "Fintech Brand Identity",
      burnoutRisk: "Low",
      tenure: "3.2 years",
      rating: 4.9,
      awards: ["Design Lead of Q3", "Client Favorite"]
    },
    {
      id: 2,
      name: "Marcus T.",
      role: "Full-stack Developer",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200",
      alignment: 85,
      engagement: 95,
      vitality: 42,
      status: "High Output / At Risk",
      currentFocus: "API Integration",
      burnoutRisk: "High",
      tenure: "1.5 years",
      rating: 4.7,
      awards: ["Bug Crusher 2023"]
    },
    {
      id: 3,
      name: "Elena Moss",
      role: "Project Manager",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200",
      alignment: 98,
      engagement: 90,
      vitality: 82,
      status: "Strategic Lead",
      currentFocus: "Q4 Planning",
      burnoutRisk: "Low",
      tenure: "4.1 years",
      rating: 5.0,
      awards: ["Visionary Award", "Top Mentor"]
    }
  ];

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star} 
            className={cn(
              "w-3 h-3", 
              star <= Math.floor(rating) ? "fill-amber-400 text-amber-400" : "text-slate-200"
            )} 
          />
        ))}
        <span className="text-[10px] font-bold text-slate-600 ml-1">{rating}</span>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Team Optimization & Vitality</h1>
            <p className="text-slate-500">Aligning human potential with organizational vision and well-being.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-slate-200">Vitality Report</Button>
            <Link to="/staff-onboarding">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 shadow-lg shadow-indigo-100">
                <UserPlus className="w-4 h-4" />
                Onboard New Staff
              </Button>
            </Link>
          </div>
        </div>

        {/* Team Health Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-none shadow-sm bg-indigo-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-white/10">
                  <Compass className="w-5 h-5" />
                </div>
                <Badge className="bg-white/20 text-white border-none">92% Avg</Badge>
              </div>
              <p className="text-indigo-100 text-sm font-medium">Vision Alignment</p>
              <h3 className="text-2xl font-bold">Strategic Synergy</h3>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                  <Zap className="w-5 h-5" />
                </div>
                <Badge className="bg-emerald-50 text-emerald-700 border-none">High</Badge>
              </div>
              <p className="text-sm font-medium text-slate-500">JD Engagement</p>
              <h3 className="text-2xl font-bold text-slate-900">Role Mastery</h3>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-rose-50 text-rose-600">
                  <HeartPulse className="w-5 h-5" />
                </div>
                <Badge className="bg-rose-50 text-rose-700 border-none">1 At Risk</Badge>
              </div>
              <p className="text-sm font-medium text-slate-500">Team Vitality</p>
              <h3 className="text-2xl font-bold text-slate-900">Balance Score</h3>
            </CardContent>
          </Card>
        </div>

        {/* Staff Visualization Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">Performance & Vitality Matrix</h3>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="text-slate-500">All Staff</Button>
                <Button variant="ghost" size="sm" className="text-slate-500">At Risk</Button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {team.map((member) => (
                <Card key={member.id} className="border-none shadow-sm hover:shadow-md transition-all group">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-8">
                      {/* Profile Info Section */}
                      <div className="flex flex-col items-center md:items-start gap-4 min-w-[200px]">
                        <div className="relative">
                          <Avatar className="w-24 h-24 rounded-3xl border-4 border-white shadow-xl overflow-hidden">
                            <AvatarImage src={member.avatar} className="object-cover" />
                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1.5 shadow-lg border border-slate-50">
                            {renderStars(member.rating)}
                          </div>
                        </div>
                        <div className="text-center md:text-left space-y-1">
                          <Link to={`/staff/${member.id}`} className="hover:text-indigo-600 transition-colors">
                            <h4 className="font-bold text-lg text-slate-900">{member.name}</h4>
                          </Link>
                          <p className="text-xs font-medium text-slate-500">{member.role}</p>
                          <div className="flex items-center justify-center md:justify-start gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                            <Calendar className="w-3 h-3" />
                            {member.tenure} with us
                          </div>
                        </div>
                      </div>

                      {/* Metrics & Awards Section */}
                      <div className="flex-1 space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                          <div className="space-y-2">
                            <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                              <span>Alignment</span>
                              <span className="text-slate-900">{member.alignment}%</span>
                            </div>
                            <Progress value={member.alignment} className="h-1.5 bg-slate-100 [&>div]:bg-indigo-500" />
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                              <span>Engagement</span>
                              <span className="text-slate-900">{member.engagement}%</span>
                            </div>
                            <Progress value={member.engagement} className="h-1.5 bg-slate-100 [&>div]:bg-emerald-500" />
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                              <span>Vitality</span>
                              <span className={cn(
                                "font-bold",
                                member.vitality < 50 ? "text-rose-600" : "text-slate-900"
                              )}>{member.vitality}%</span>
                            </div>
                            <Progress value={member.vitality} className={cn(
                              "h-1.5 bg-slate-100",
                              member.vitality < 50 ? "[&>div]:bg-rose-500" : "[&>div]:bg-blue-500"
                            )} />
                          </div>
                        </div>

                        {/* Awards Section */}
                        <div className="space-y-2">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Internal Awards</p>
                          <div className="flex flex-wrap gap-2">
                            {member.awards.map((award, i) => (
                              <Badge key={i} variant="secondary" className="bg-amber-50 text-amber-700 border-none text-[10px] px-2 py-1 flex items-center gap-1.5">
                                <Trophy className="w-3 h-3" />
                                {award}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-start gap-2">
                        <Link to={`/staff/${member.id}`}>
                          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-indigo-600">
                            <ArrowUpRight className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button variant="ghost" size="icon" className="text-slate-400">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Current Workflow Footer */}
                    <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-xs text-slate-600">Current Focus: <span className="font-bold text-slate-900">{member.currentFocus}</span></span>
                      </div>
                      {member.burnoutRisk === "High" && (
                        <div className="flex items-center gap-1.5 text-rose-600 animate-pulse">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-bold uppercase tracking-wider">Intervention Recommended</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Strategic Insights Sidebar */}
          <div className="space-y-6">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Organizational Alignment</CardTitle>
                <CardDescription>How the team maps to the company vision.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                  <div className="flex gap-3 mb-3">
                    <Target className="w-5 h-5 text-indigo-600 shrink-0" />
                    <p className="text-sm font-bold text-indigo-900">Vision: "Global Design Leader"</p>
                  </div>
                  <p className="text-xs text-indigo-700 leading-relaxed">
                    85% of current team tasks are directly contributing to this vision. 15% are administrative overhead.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Top Contributors</h4>
                  {[
                    { name: "Elena Moss", impact: "Strategic", score: 98 },
                    { name: "Sarah Chen", impact: "Creative", score: 92 },
                  ].map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                        <span className="text-sm font-medium text-slate-700">{item.name}</span>
                      </div>
                      <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-none text-[10px]">
                        {item.impact}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-slate-900 text-white">
              <CardContent className="p-8 text-center space-y-6">
                <div className="w-16 h-16 bg-rose-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl shadow-rose-500/20">
                  <HeartPulse className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Vitality Alert</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {vitalityInsight || "Click below to get an AI-powered analysis of your team's well-being and burnout risks."}
                  </p>
                </div>
                <Button
                  className="w-full bg-white text-slate-900 hover:bg-slate-100 font-bold py-6 rounded-xl gap-2"
                  onClick={handleVitalityAlert}
                  disabled={isLoadingVitality}
                >
                  {isLoadingVitality ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing Team...</>
                  ) : (
                    <><Sparkles className="w-4 h-4" /> {vitalityInsight ? "Refresh Analysis" : "Analyze Team Vitality"}</>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TeamOptimization;