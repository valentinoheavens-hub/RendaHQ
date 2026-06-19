"use client";

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Github,
  ArrowRight,
  Loader2,
  Chrome,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { showError, showSuccess } from "@/utils/toast";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

export default function SignIn() {
  const navigate = useNavigate();
  const { signIn, signUp, resetPassword } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { showError("Please fill in all fields."); return; }
    if (mode === "signup" && !name) { showError("Please enter your name."); return; }
    if (mode === "signup" && password.length < 8) { showError("Password must be at least 8 characters."); return; }

    setIsLoading(true);
    if (mode === "signin") {
      const { error } = await signIn(email, password);
      if (error) { showError(error); setIsLoading(false); return; }
      showSuccess("Welcome back!");
      navigate("/dashboard", { replace: true });
    } else {
      const { error } = await signUp(email, password, name);
      if (error) { showError(error); setIsLoading(false); return; }
      // Attempt immediate sign-in — works when email confirmation is disabled.
      // If confirmation is required, signIn will fail and the user sees the email prompt.
      const { error: signInError } = await signIn(email, password);
      if (!signInError) {
        showSuccess("Welcome to RendaHQ!");
        navigate("/dashboard");
      } else {
        showSuccess("Account created! Check your email to confirm your address, then sign in.");
        setMode("signin");
      }
    }
    setIsLoading(false);
  };

  const handleForgotPassword = async () => {
    if (!email) { showError("Enter your email address first."); return; }
    const { error } = await resetPassword(email);
    if (error) { showError(error); return; }
    showSuccess("Password reset email sent!");
  };

  const handleOAuth = async (provider: "github" | "google") => {
    setOauthLoading(provider);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
    if (error) {
      showError(error.message);
      setOauthLoading(null);
    }
    // On success the browser redirects to the OAuth provider — keep loading state
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 flex-col justify-between p-12 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

        {/* Logo */}
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-900/50">
              <span className="text-white font-bold text-2xl">R</span>
            </div>
            <span className="font-bold text-2xl tracking-tight text-white">RendaHQ</span>
          </Link>
          <p className="text-emerald-300 font-medium text-sm mt-3 ml-1">Build. Bill. Get paid.</p>
        </div>

        {/* Testimonial */}
        <div className="relative z-10 space-y-8">
          <blockquote className="text-2xl font-semibold text-white leading-relaxed">
            "RendaHQ replaced 4 tools I was paying for. My client relationships have never been more professional."
          </blockquote>
          <div className="flex items-center gap-4">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Amara"
              alt="Amara Osei"
              className="w-12 h-12 rounded-full bg-emerald-800"
            />
            <div>
              <p className="font-bold text-white">Amara Osei</p>
              <p className="text-slate-400 text-sm">Brand Strategist, Accra</p>
            </div>
          </div>
        </div>

        {/* Feature chips */}
        <div className="relative z-10 flex flex-wrap gap-2">
          {["White-labeled portals", "AI contracts", "Paystack + Flutterwave + Stripe", "Scope protection", "African payment rails"].map((f) => (
            <span key={f} className="px-3 py-1.5 bg-white/10 rounded-full text-xs font-medium text-slate-300 border border-white/10">
              {f}
            </span>
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link to="/" className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">R</span>
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">RendaHQ</span>
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-black text-slate-900 mb-2">
              {mode === "signin" ? "Welcome back" : "Create your account"}
            </h1>
            <p className="text-slate-500">
              {mode === "signin"
                ? "Sign in to your RendaHQ workspace."
                : "Start your 14-day free trial. No card required."}
            </p>
          </div>

          {/* OAuth buttons */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <Button
              variant="outline"
              className="border-slate-200 gap-2 h-11"
              onClick={() => handleOAuth("github")}
              disabled={!!oauthLoading}
            >
              {oauthLoading === "github" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Github className="w-4 h-4" />
              )}
              GitHub
            </Button>
            <Button
              variant="outline"
              className="border-slate-200 gap-2 h-11"
              onClick={() => handleOAuth("google")}
              disabled={!!oauthLoading}
            >
              {oauthLoading === "google" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Chrome className="w-4 h-4" />
              )}
              Google
            </Button>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <Separator className="flex-1 bg-slate-200" />
            <span className="text-xs font-medium text-slate-400 shrink-0">or continue with email</span>
            <Separator className="flex-1 bg-slate-200" />
          </div>

          {/* Email form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-slate-700 font-medium text-sm">
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="e.g. Felix Kimani"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-11 border-slate-200 focus-visible:ring-emerald-500"
                  autoComplete="name"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-slate-700 font-medium text-sm">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@agency.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 pl-10 border-slate-200 focus-visible:ring-emerald-500"
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-slate-700 font-medium text-sm">
                  Password
                </Label>
                {mode === "signin" && (
                  <button
                    type="button"
                    className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                    onClick={handleForgotPassword}
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={mode === "signup" ? "Min. 8 characters" : "••••••••"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 pl-10 pr-10 border-slate-200 focus-visible:ring-emerald-500"
                  autoComplete={mode === "signin" ? "current-password" : "new-password"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl mt-2 gap-2 shadow-lg shadow-emerald-100"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  {mode === "signin" ? "Sign In" : "Create Account"}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            {mode === "signin" ? (
              <>
                Don't have an account?{" "}
                <button
                  onClick={() => setMode("signup")}
                  className="font-bold text-emerald-600 hover:text-emerald-700"
                >
                  Sign up free
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => setMode("signin")}
                  className="font-bold text-emerald-600 hover:text-emerald-700"
                >
                  Sign in
                </button>
              </>
            )}
          </p>

          {mode === "signup" && (
            <p className="text-center text-xs text-slate-400 mt-4 leading-relaxed">
              By creating an account, you agree to our{" "}
              <a href="#" className="underline hover:text-slate-600">Terms of Service</a>
              {" "}and{" "}
              <a href="#" className="underline hover:text-slate-600">Privacy Policy</a>.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
