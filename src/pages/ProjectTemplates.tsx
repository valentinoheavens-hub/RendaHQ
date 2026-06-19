"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Search, 
  Copy, 
  Trash2, 
  Layers, 
  Target, 
  CheckCircle2, 
  Clock,
  MoreVertical,
  ArrowRight,
  Sparkles,
  Edit2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { showSuccess } from "@/utils/toast";

const ProjectTemplates = () => {
  const [templates, setTemplates] = useState([
    { 
      id: 1, 
      name: "Brand Identity Redesign", 
      category: "Design", 
      milestones: 4, 
      tasks: 12, 
      estDuration: "6 weeks",
      description: "Standard workflow for complete visual identity projects."
    },
    { 
      id: 2, 
      name: "SaaS MVP Development", 
      category: "Development", 
      milestones: 6, 
      tasks: 24, 
      estDuration: "12 weeks",
      description: "End-to-end development cycle for early-stage software products."
    },
    { 
      id: 3, 
      name: "Monthly SEO Retainer", 
      category: "Marketing", 
      milestones: 3, 
      tasks: 8, 
      estDuration: "Ongoing",
      description: "Recurring monthly tasks for search engine optimization."
    }
  ]);

  const handleDuplicate = (name: string) => {
    showSuccess(`Template "${name}" duplicated successfully!`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Project Templates</h1>
            <p className="text-slate-500">Standardize your delivery with reusable project structures.</p>
          </div>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 shadow-lg shadow-emerald-100">
            <Plus className="w-4 h-4" />
            Create Template
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input placeholder="Search templates..." className="pl-10 bg-white border-slate-200" />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="border-slate-200">All Categories</Button>
            <Button variant="ghost" className="text-slate-500">Design</Button>
            <Button variant="ghost" className="text-slate-500">Development</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <Card key={template.id} className="border-none shadow-sm hover:shadow-md transition-all group">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <Layers className="w-6 h-6" />
                  </div>
                  <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-none text-[10px]">
                    {template.category}
                  </Badge>
                </div>
                
                <div className="space-y-2 mb-6">
                  <h3 className="font-bold text-lg text-slate-900 group-hover:text-emerald-600 transition-colors">
                    {template.name}
                  </h3>
                  <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
                    {template.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-50 mb-6">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Milestones</p>
                      <p className="font-bold text-slate-900 text-sm">{template.milestones}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Est. Time</p>
                      <p className="font-bold text-slate-900 text-sm">{template.estDuration}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" className="flex-1 border-slate-200 text-slate-600 gap-2">
                    <Edit2 className="w-3.5 h-3.5" />
                    Edit
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-slate-400"
                    onClick={() => handleDuplicate(template.name)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-slate-400">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          
          <button className="border-2 border-dashed border-slate-200 rounded-3xl p-6 flex flex-col items-center justify-center text-slate-400 hover:border-emerald-300 hover:text-emerald-500 transition-all min-h-[280px] group">
            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-4 group-hover:bg-emerald-50">
              <Plus className="w-6 h-6" />
            </div>
            <p className="font-bold">New Template</p>
            <p className="text-sm">Standardize your work</p>
          </button>
        </div>

        <Card className="border-none shadow-sm bg-slate-900 text-white">
          <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-500/20">
                <Sparkles className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1">AI Template Generator</h3>
                <p className="text-slate-400 text-sm max-w-md">
                  Describe your service in plain English and our AI will build a complete project template with milestones and tasks.
                </p>
              </div>
            </div>
            <Button className="bg-white text-slate-900 hover:bg-slate-100 font-bold px-8 py-6 rounded-xl shrink-0">
              Generate with AI
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ProjectTemplates;