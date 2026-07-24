// Initializes a Flutterwave payment tied to a recurring Payment Plan so it
// charges monthly. Returns the hosted checkout link to redirect the user to.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const secretKey = Deno.env.get("FLW_SECRET_KEY");
    if (!secretKey) return json({ error: "Flutterwave is not configured." }, 500);

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const userClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } },
    });
    const { data: { user }, error: userErr } = await userClient.auth.getUser();
    if (userErr || !user) return json({ error: "Not authenticated." }, 401);
    if (!user.email) return json({ error: "Account has no email." }, 400);

    const { redirectUrl, billingCycle } = await req.json();
    const isYearly = billingCycle === "yearly";

    // Pick the recurring Payment Plan + amount for the requested cycle. Falls
    // back to the monthly plan if a yearly plan hasn't been created yet.
    const monthlyPlan = Deno.env.get("FLW_AGENCY_PLAN_ID");
    const yearlyPlan = Deno.env.get("FLW_AGENCY_YEARLY_PLAN_ID");
    const planId = isYearly ? (yearlyPlan ?? monthlyPlan) : monthlyPlan;
    if (!planId) return json({ error: "Flutterwave Agency plan is not configured." }, 500);

    // Amount/currency should match the Payment Plan created in Flutterwave.
    const amount = isYearly
      ? (Deno.env.get("FLW_AGENCY_YEARLY_AMOUNT") ?? "278")
      : (Deno.env.get("FLW_AGENCY_AMOUNT") ?? "29");
    const currency = Deno.env.get("FLW_AGENCY_CURRENCY") ?? "USD";

    const txRef = `rendahq-${user.id}-${Date.now()}`;

    const res = await fetch("https://api.flutterwave.com/v3/payments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tx_ref: txRef,
        amount,
        currency,
        redirect_url: redirectUrl,
        payment_plan: planId,
        customer: { email: user.email },
        meta: { user_id: user.id, purpose: "rendahq_subscription" },
        customizations: {
          title: "RendaHQ Agency",
          description: isYearly ? "Annual subscription (20% off)" : "Monthly subscription",
        },
      }),
    });

    const data = await res.json();
    if (data.status !== "success") {
      return json({ error: data.message || "Flutterwave init failed." }, 502);
    }

    const admin = createClient(supabaseUrl, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    await admin.from("subscriptions").update({ provider: "flutterwave" }).eq("user_id", user.id);

    return json({ url: data.data.link });
  } catch (err) {
    console.error("subscribe-flutterwave error:", err);
    return json({ error: (err as Error).message }, 500);
  }
});
