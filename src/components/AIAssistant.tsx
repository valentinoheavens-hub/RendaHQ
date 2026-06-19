"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  X,
  Send,
  Loader2,
  ChevronDown,
  Mail,
  FileText,
  TrendingUp,
  Lightbulb,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { askBusinessAssistant, ChatMessage } from "@/lib/ai";
import { showError } from "@/utils/toast";

const QUICK_PROMPTS = [
  { label: "Draft a follow-up email", icon: Mail, prompt: "Help me draft a professional follow-up email to a potential client I spoke with yesterday about a branding project." },
  { label: "Write a proposal intro", icon: FileText, prompt: "Write a compelling executive summary / intro paragraph for a proposal to redesign a fintech startup's mobile app." },
  { label: "Pricing advice", icon: TrendingUp, prompt: "I'm a freelance designer. How should I price a brand identity project for a startup? Give me a framework." },
  { label: "Business tip", icon: Lightbulb, prompt: "Give me one high-impact tip to improve client retention for my agency." },
];

const WELCOME_MESSAGE: ChatMessage = {
  role: "assistant",
  content: "Hey! I'm your **RendaHQ AI Assistant**. I can help you draft emails, write proposals, strategize on deals, answer pricing questions — anything to grow your business. What do you need?",
};

export const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [messages, isOpen]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: "user", content };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInputValue("");
    setIsLoading(true);

    try {
      // Exclude the welcome message from the API call (it's synthetic)
      const apiMessages = nextMessages.filter((_, i) => i > 0 || nextMessages[0].role !== "assistant");
      // Always include at least the user message
      const callMessages = nextMessages.slice(1); // skip welcome
      const reply = await askBusinessAssistant(callMessages.length ? callMessages : [userMsg]);
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch (err: any) {
      showError(err.message ?? "AI request failed");
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "⚠️ I couldn't connect to the AI right now. Please check your API key in environment variables."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  const resetChat = () => {
    setMessages([WELCOME_MESSAGE]);
    setInputValue("");
  };

  // Simple markdown-like bold rendering
  const renderText = (text: string) => {
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, i) =>
      i % 2 === 1 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>
    );
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(v => !v)}
        className={cn(
          "fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl shadow-2xl flex items-center justify-center transition-all duration-300",
          isOpen
            ? "bg-slate-800 rotate-0 scale-95"
            : "bg-emerald-600 hover:bg-emerald-700 hover:scale-110 shadow-emerald-300"
        )}
        aria-label="Toggle AI Assistant"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <Sparkles className="w-6 h-6 text-white" />
        )}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white animate-pulse" />
        )}
      </button>

      {/* Panel */}
      <div
        className={cn(
          "fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-24px)] bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col transition-all duration-300 origin-bottom-right",
          isOpen
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-4 pointer-events-none"
        )}
        style={{ maxHeight: "calc(100vh - 140px)" }}
      >
        {/* Header */}
        <div className="bg-emerald-600 rounded-t-3xl p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">RendaHQ AI</h3>
              <p className="text-emerald-200 text-[11px]">Your business co-pilot</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={resetChat}
              className="p-1.5 rounded-lg hover:bg-white/20 text-emerald-200 hover:text-white transition-colors"
              title="Clear chat"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg hover:bg-white/20 text-emerald-200 hover:text-white transition-colors"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Prompts (shown when only welcome message) */}
        {messages.length === 1 && (
          <div className="px-4 pt-4 grid grid-cols-2 gap-2 shrink-0">
            {QUICK_PROMPTS.map((qp) => (
              <button
                key={qp.label}
                onClick={() => sendMessage(qp.prompt)}
                disabled={isLoading}
                className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/50 text-left transition-all group text-xs font-medium text-slate-600 hover:text-emerald-700"
              >
                <qp.icon className="w-3.5 h-3.5 text-emerald-400 group-hover:text-emerald-600 shrink-0" />
                {qp.label}
              </button>
            ))}
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
          {messages.map((msg, i) => (
            <div key={i} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
              {msg.role === "assistant" && (
                <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0 mr-2 mt-0.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                </div>
              )}
              <div
                className={cn(
                  "max-w-[82%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                  msg.role === "user"
                    ? "bg-emerald-600 text-white rounded-tr-none"
                    : "bg-slate-50 text-slate-700 rounded-tl-none border border-slate-100"
                )}
              >
                {msg.role === "assistant"
                  ? msg.content.split("\n").map((line, j) => (
                      <p key={j} className={line === "" ? "mt-2" : ""}>
                        {renderText(line)}
                      </p>
                    ))
                  : msg.content}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0 mr-2 mt-0.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-2xl rounded-tl-none px-4 py-3">
                <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 border-t border-slate-100 shrink-0">
          <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2 border border-slate-200 focus-within:border-emerald-300 focus-within:ring-2 focus-within:ring-emerald-100 transition-all">
            <input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about your business…"
              className="flex-1 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 outline-none"
              disabled={isLoading}
            />
            <button
              onClick={() => sendMessage(inputValue)}
              disabled={!inputValue.trim() || isLoading}
              className={cn(
                "w-7 h-7 rounded-lg flex items-center justify-center transition-all",
                inputValue.trim() && !isLoading
                  ? "bg-emerald-600 text-white hover:bg-emerald-700"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              )}
            >
              {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            </button>
          </div>
          <p className="text-center text-[10px] text-slate-300 mt-2">RendaHQ AI · Your Business Co-Pilot</p>
        </div>
      </div>
    </>
  );
};

export default AIAssistant;
