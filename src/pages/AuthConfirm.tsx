"use client";

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { showSuccess } from "@/utils/toast";

type EmailOtpType = "signup" | "magiclink" | "recovery" | "email_change" | "email" | "invite";

// Exchanges a one-time email token (token_hash flow) for a session, then routes
// the user on. The link points straight here, so email-client link prefetch
// can't burn the token — only the user's browser (running JS) exchanges it.
export default function AuthConfirm() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const url = new URL(window.location.href);
    const tokenHash = url.searchParams.get("token_hash");
    const type = (url.searchParams.get("type") as EmailOtpType | null) ?? "email";
    const code = url.searchParams.get("code");
    const next = url.searchParams.get("next") || "/dashboard";

    const run = async () => {
      // Password recovery needs the set-new-password form, not a silent redirect.
      if (type === "recovery" && tokenHash) {
        navigate(`/reset-password?token_hash=${tokenHash}&type=recovery`, { replace: true });
        return;
      }

      if (tokenHash) {
        const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });
        if (error) { setError(error.message); return; }
        showSuccess("Email verified!");
        navigate(next, { replace: true });
        return;
      }

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) { setError(error.message); return; }
        navigate(next, { replace: true });
        return;
      }

      // Legacy implicit-hash links: detectSessionInUrl already ran; check session.
      const { data: { session } } = await supabase.auth.getSession();
      if (session) { navigate(next, { replace: true }); return; }
      setTimeout(async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) navigate(next, { replace: true });
        else setError("This link is invalid or has expired.");
      }, 2500);
    };

    run();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 mb-10">
          <img src="/rendahq-logo.png" alt="RendaHQ" className="h-10 w-auto" />
        </Link>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
          {!error ? (
            <div className="py-8 flex flex-col items-center">
              <Loader2 className="w-7 h-7 text-emerald-600 animate-spin mb-3" />
              <p className="text-slate-500 text-sm">Confirming your link…</p>
            </div>
          ) : (
            <div className="py-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-6 h-6 text-rose-500" />
              </div>
              <h1 className="text-xl font-black text-slate-900 mb-2">Link expired or already used</h1>
              <p className="text-slate-500 text-sm mb-6">{error}</p>
              <Link to="/signin">
                <Button className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl">
                  Back to sign in
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
