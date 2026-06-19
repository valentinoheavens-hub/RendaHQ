"use client";

import React, { useState, useRef, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Send,
  Paperclip,
  MoreVertical,
  Phone,
  Video,
  Sparkles,
  Loader2,
  X,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { generateEmailDraft } from "@/lib/ai";
import { showError } from "@/utils/toast";

interface Message {
  id: number;
  sender: string;
  text: string;
  time: string;
  isMe: boolean;
}

interface Chat {
  id: number;
  name: string;
  company: string;
  lastMsg: string;
  time: string;
  unread: number;
  avatar: string;
}

const initialChats: Chat[] = [
  { id: 1, name: "John Doe", company: "Acme Corp", lastMsg: "The logo concepts look great!", time: "2m ago", unread: 2, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John" },
  { id: 2, name: "Sarah Smith", company: "Global Tech", lastMsg: "Can we schedule a call for tomorrow?", time: "1h ago", unread: 0, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" },
  { id: 3, name: "Mike Ross", company: "Zest Foods", lastMsg: "Invoice received, thank you.", time: "3h ago", unread: 0, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike" },
];

const initialMessagesByChat: Record<number, Message[]> = {
  1: [
    { id: 1, sender: "John Doe", text: "Hi Felix, I've reviewed the initial discovery document.", time: "10:30 AM", isMe: false },
    { id: 2, sender: "Me", text: "Great! Any specific feedback on the target audience section?", time: "10:35 AM", isMe: true },
    { id: 3, sender: "John Doe", text: "It's spot on. I think we should lean more into the 'premium' feel for the brand identity.", time: "10:40 AM", isMe: false },
    { id: 4, sender: "John Doe", text: "The logo concepts look great!", time: "10:42 AM", isMe: false },
  ],
  2: [
    { id: 1, sender: "Sarah Smith", text: "Hey Felix, we're really happy with how the mobile UI is shaping up.", time: "9:00 AM", isMe: false },
    { id: 2, sender: "Me", text: "Glad to hear it! I'll have the final screens ready by Friday.", time: "9:05 AM", isMe: true },
    { id: 3, sender: "Sarah Smith", text: "Can we schedule a call for tomorrow?", time: "9:10 AM", isMe: false },
  ],
  3: [
    { id: 1, sender: "Mike Ross", text: "Hi, just wanted to confirm receipt of our last deliverable.", time: "Yesterday", isMe: false },
    { id: 2, sender: "Me", text: "Happy to confirm! The brand guidelines PDF has been sent.", time: "Yesterday", isMe: true },
    { id: 3, sender: "Mike Ross", text: "Invoice received, thank you.", time: "3h ago", isMe: false },
  ],
};

const Messages = () => {
  const [activeChat, setActiveChat] = useState(1);
  const [messageText, setMessageText] = useState("");
  const [chats, setChats] = useState<Chat[]>(initialChats);
  const [messagesByChat, setMessagesByChat] = useState(initialMessagesByChat);
  const [isDrafting, setIsDrafting] = useState(false);
  const [draftSuggestion, setDraftSuggestion] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentChat = chats.find(c => c.id === activeChat)!;
  const messages = messagesByChat[activeChat] ?? [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeChat]);

  const sendMessage = () => {
    const text = messageText.trim();
    if (!text) return;

    const newMsg: Message = {
      id: Date.now(),
      sender: "Me",
      text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isMe: true,
    };

    setMessagesByChat(prev => ({
      ...prev,
      [activeChat]: [...(prev[activeChat] ?? []), newMsg],
    }));
    setChats(prev =>
      prev.map(c => c.id === activeChat ? { ...c, lastMsg: text, time: "Just now", unread: 0 } : c)
    );
    setMessageText("");
    setDraftSuggestion(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleDraftWithAI = async () => {
    if (isDrafting) return;
    setIsDrafting(true);
    setDraftSuggestion(null);

    try {
      const lastIncoming = [...messages].reverse().find(m => !m.isMe);
      const context = lastIncoming
        ? `Reply to ${currentChat.name} from ${currentChat.company} who said: "${lastIncoming.text}". Keep it brief, professional, and friendly.`
        : `Write a professional check-in message to ${currentChat.name} from ${currentChat.company}.`;

      const draft = await generateEmailDraft({
        recipientName: currentChat.name,
        recipientCompany: currentChat.company,
        context,
        senderName: "Felix",
        tone: "friendly",
      });
      setDraftSuggestion(draft);
      setMessageText(draft);
    } catch (err: any) {
      showError(err.message ?? "AI draft failed");
    } finally {
      setIsDrafting(false);
    }
  };

  const selectChat = (id: number) => {
    setActiveChat(id);
    setMessageText("");
    setDraftSuggestion(null);
    // Clear unread
    setChats(prev => prev.map(c => c.id === id ? { ...c, unread: 0 } : c));
  };

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-160px)] flex gap-6">
        {/* Chat List */}
        <Card className="w-80 border-none shadow-sm flex flex-col">
          <div className="p-4 border-b border-slate-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input placeholder="Search messages..." className="pl-10 bg-slate-50 border-none" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {chats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => selectChat(chat.id)}
                className={cn(
                  "w-full p-4 flex gap-3 hover:bg-slate-50 transition-colors text-left border-b border-slate-50",
                  activeChat === chat.id && "bg-emerald-50/50 border-l-4 border-l-emerald-600"
                )}
              >
                <div className="relative">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={chat.avatar} />
                    <AvatarFallback>{chat.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-0.5">
                    <h4 className="font-bold text-sm text-slate-900 truncate">{chat.name}</h4>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap">{chat.time}</span>
                  </div>
                  <p className="text-xs text-slate-500 truncate">{chat.lastMsg}</p>
                </div>
                {chat.unread > 0 && (
                  <div className="w-4 h-4 bg-emerald-600 rounded-full flex items-center justify-center text-[10px] text-white font-bold shrink-0">
                    {chat.unread}
                  </div>
                )}
              </button>
            ))}
          </div>
        </Card>

        {/* Chat Window */}
        <Card className="flex-1 border-none shadow-sm flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={currentChat.avatar} />
                <AvatarFallback>{currentChat.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-bold text-slate-900">{currentChat.name}</h4>
                <p className="text-xs text-slate-500">{currentChat.company} · <span className="text-emerald-500 font-medium">Online</span></p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-emerald-600">
                <Phone className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-emerald-600">
                <Video className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-slate-400">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30">
            {messages.map((msg) => (
              <div key={msg.id} className={cn("flex items-end gap-2", msg.isMe ? "justify-end" : "justify-start")}>
                {!msg.isMe && (
                  <Avatar className="w-7 h-7 shrink-0">
                    <AvatarImage src={currentChat.avatar} />
                    <AvatarFallback className="text-[10px]">{msg.sender.charAt(0)}</AvatarFallback>
                  </Avatar>
                )}
                <div className={cn(
                  "max-w-[70%] p-3.5 rounded-2xl text-sm shadow-sm",
                  msg.isMe
                    ? "bg-emerald-600 text-white rounded-tr-sm"
                    : "bg-white text-slate-700 rounded-tl-sm border border-slate-100"
                )}>
                  <p className="leading-relaxed">{msg.text}</p>
                  <p className={cn("text-[10px] mt-1.5", msg.isMe ? "text-emerald-200" : "text-slate-400")}>
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* AI Draft Suggestion Banner */}
          {draftSuggestion && (
            <div className="mx-4 mb-1 p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <p className="text-xs text-emerald-700 flex-1 leading-relaxed">
                <span className="font-bold">AI draft loaded.</span> Edit the message below or send as-is.
              </p>
              <button onClick={() => setDraftSuggestion(null)} className="text-emerald-400 hover:text-emerald-600">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 border-t border-slate-100 shrink-0">
            <div className="flex items-center gap-2 mb-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDraftWithAI}
                disabled={isDrafting}
                className="gap-1.5 border-emerald-200 text-emerald-600 hover:bg-emerald-50 text-xs rounded-lg"
              >
                {isDrafting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                {isDrafting ? "Drafting…" : "Draft with AI"}
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="text-slate-400 shrink-0">
                <Paperclip className="w-5 h-5" />
              </Button>
              <Input
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message…"
                className="flex-1 bg-slate-50 border-none focus-visible:ring-1 focus-visible:ring-emerald-500"
              />
              <Button
                onClick={sendMessage}
                disabled={!messageText.trim()}
                className="bg-emerald-600 hover:bg-emerald-700 text-white shrink-0 disabled:opacity-40"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Messages;
