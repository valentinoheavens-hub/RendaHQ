import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  ArrowRight,
  Shield,
  Zap,
  Globe,
  Smartphone,
  BarChart3,
  FileSignature
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MadeWithDyad } from "@/components/made-with-dyad";

const Index = () => {
  return (
    <div className="min-h-screen bg-white selection:bg-indigo-100">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <span className="text-white font-bold text-2xl">N</span>
          </div>
          <span className="font-bold text-2xl tracking-tight text-slate-900">NexWork</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
          <a href="#pricing" className="hover:text-indigo-600 transition-colors">Pricing</a>
          <a href="#about" className="hover:text-indigo-600 transition-colors">About</a>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/dashboard">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 shadow-lg shadow-indigo-100">
              Open Dashboard
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-32 px-6 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 text-sm font-bold mb-8 animate-fade-in">
          <Zap className="w-4 h-4" />
          <span>The Business OS for Modern Freelancers</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight mb-8 leading-[1.1]">
          Your business, <br />
          <span className="text-indigo-600">one branded workspace.</span>
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed">
          Replace Notion, DocuSign, and Stripe with a single white-labeled portal. 
          Built for freelancers and agencies in emerging markets.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/dashboard">
            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-7 text-lg rounded-2xl shadow-xl shadow-indigo-200 group">
              Go to Dashboard
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link to="/portal/demo">
            <Button size="lg" variant="outline" className="px-8 py-7 text-lg rounded-2xl border-slate-200 text-slate-600 hover:bg-slate-50">
              View Demo Portal
            </Button>
          </Link>
        </div>

        {/* Hero Image / Dashboard Preview */}
        <div className="mt-20 relative">
          <div className="absolute inset-0 bg-indigo-600/5 blur-3xl rounded-full -z-10" />
          <div className="rounded-3xl border border-slate-200 shadow-2xl overflow-hidden bg-white">
            <img 
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2426" 
              alt="NexWork Dashboard" 
              className="w-full h-auto opacity-90"
            />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 bg-slate-50 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Everything you need to scale</h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Stop juggling tools. NexWork brings your entire client lifecycle into one professional environment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { 
                title: "White-Labeled Portals", 
                desc: "Give every client a professional workspace under your own brand and domain.",
                icon: Globe,
                color: "bg-blue-500"
              },
              { 
                title: "AI Contract Builder", 
                desc: "Describe your scope in plain English and generate professional contracts in seconds.",
                icon: FileSignature,
                color: "bg-indigo-500"
              },
              { 
                title: "Scope Change Management", 
                desc: "The first tool with formal change orders to stop scope creep before it starts.",
                icon: Shield,
                color: "bg-emerald-500"
              },
              { 
                title: "African Payment Rails", 
                desc: "Native support for Paystack, Flutterwave, and M-Pesa alongside Stripe.",
                icon: Smartphone,
                color: "bg-amber-500"
              },
              { 
                title: "Milestone Tracking", 
                desc: "Clients approve deliverables and milestones directly in their portal.",
                icon: CheckCircle2,
                color: "bg-rose-500"
              },
              { 
                title: "Advanced Reporting", 
                desc: "Track revenue, project health, and tax summaries in one dashboard.",
                icon: BarChart3,
                color: "bg-violet-500"
              },
            ].map((feature, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg", feature.color)}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto bg-slate-900 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">Ready to professionalize <br />your service business?</h2>
            <p className="text-slate-400 text-lg mb-12 max-w-xl mx-auto">
              Join 500+ freelancers and agencies who have upgraded their client experience with NexWork.
            </p>
            <Link to="/dashboard">
              <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 px-10 py-7 text-lg rounded-2xl font-bold">
                Go to Dashboard
              </Button>
            </Link>
          </div>
          <div className="absolute top-0 left-0 w-full h-full bg-indigo-600/10 -z-0" />
        </div>
      </section>

      <footer className="py-12 border-t border-slate-100 text-center">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">N</span>
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">NexWork</span>
          </div>
          <p className="text-slate-400 text-sm mb-8">© 2023 NexWork OS. All rights reserved.</p>
          <MadeWithDyad />
        </div>
      </footer>
    </div>
  );
};

export default Index;