import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Plus, 
  GripVertical, 
  Trash2, 
  Settings, 
  Eye, 
  Save,
  Type,
  AlignLeft,
  List,
  Calendar,
  Upload,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { showSuccess } from "@/utils/toast";

interface Question {
  id: number;
  type: string;
  label: string;
  placeholder: string;
  options?: string[];
}

const QuestionnaireBuilder = () => {
  const [questions, setQuestions] = useState<Question[]>([
    { id: 1, type: "short", label: "What is your company's legal name?", placeholder: "e.g. Acme Corp LLC" },
    { id: 2, type: "long", label: "Describe your project goals in detail.", placeholder: "What are you hoping to achieve?" },
    { id: 3, type: "dropdown", label: "What is your estimated budget?", placeholder: "Select a range", options: ["$1k - $5k", "$5k - $10k", "$10k+"] },
  ]);

  const addQuestion = (type: string) => {
    const newQuestion: Question = {
      id: Date.now(),
      type,
      label: "New Question",
      placeholder: "Enter placeholder text...",
      options: type === "dropdown" ? ["Option 1", "Option 2"] : undefined
    };
    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (id: number) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const updateQuestion = (id: number, updates: Partial<Question>) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, ...updates } : q));
  };

  const handleSave = () => {
    showSuccess("Questionnaire template saved successfully!");
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Questionnaire Builder</h1>
            <p className="text-slate-500">Create intake forms to automate client onboarding.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-slate-200 gap-2">
              <Eye className="w-4 h-4" />
              Preview Form
            </Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2" onClick={handleSave}>
              <Save className="w-4 h-4" />
              Save Template
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Toolbox */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-none shadow-sm sticky top-24">
              <CardHeader>
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-400">Toolbox</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { type: "short", label: "Short Text", icon: Type },
                  { type: "long", label: "Long Text", icon: AlignLeft },
                  { type: "dropdown", label: "Dropdown", icon: List },
                  { type: "date", label: "Date Picker", icon: Calendar },
                  { type: "file", label: "File Upload", icon: Upload },
                ].map((tool) => (
                  <Button 
                    key={tool.type}
                    variant="ghost" 
                    className="w-full justify-start gap-3 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600"
                    onClick={() => addQuestion(tool.type)}
                  >
                    <tool.icon className="w-4 h-4" />
                    {tool.label}
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Builder Canvas */}
          <div className="lg:col-span-3 space-y-6">
            <Card className="border-none shadow-sm min-h-[600px] bg-slate-50/50 border-dashed border-2 border-slate-200">
              <CardContent className="p-8 space-y-6">
                {questions.length === 0 ? (
                  <div className="text-center py-20">
                    <Plus className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="font-bold text-slate-900">Start building your form</h3>
                    <p className="text-slate-500">Click a tool from the toolbox to add a question.</p>
                  </div>
                ) : (
                  questions.map((q, index) => (
                    <div key={q.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm group relative">
                      <div className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab">
                        <GripVertical className="w-4 h-4 text-slate-300" />
                      </div>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1 space-y-4">
                          <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">Question Label</Label>
                            <Input 
                              value={q.label} 
                              onChange={(e) => updateQuestion(q.id, { label: e.target.value })}
                              className="border-none bg-slate-50 font-bold text-lg focus-visible:ring-emerald-500"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">Placeholder / Help Text</Label>
                            <Input 
                              value={q.placeholder} 
                              onChange={(e) => updateQuestion(q.id, { placeholder: e.target.value })}
                              className="border-none bg-slate-50 text-slate-600 focus-visible:ring-emerald-500"
                            />
                          </div>
                          {q.type === "dropdown" && q.options && (
                            <div className="space-y-2">
                              <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">Options</Label>
                              <div className="flex flex-wrap gap-2">
                                {q.options.map((opt, i) => (
                                  <div key={i} className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-1 rounded-md text-sm">
                                    {opt}
                                    <button onClick={() => {
                                      const newOpts = q.options?.filter((_, idx) => idx !== i);
                                      updateQuestion(q.id, { options: newOpts });
                                    }}>
                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>
                                ))}
                                <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => {
                                  updateQuestion(q.id, { options: [...(q.options || []), "New Option"] });
                                }}>
                                  <Plus className="w-3 h-3 mr-1" /> Add Option
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-rose-500" onClick={() => removeQuestion(q.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-slate-400">
                            <Settings className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default QuestionnaireBuilder;