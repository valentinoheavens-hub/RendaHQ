// Creates a Stripe Checkout session in SUBSCRIPTION mode for the Agency plan.
// The user is identified from their auth JWT; the resulting subscription is
// tied back to them via metadata.user_id so the webhook can activate it.
import Stripe from "https://esm.sh/stripe@14?target=deno";
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

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "", {
  apiVersion: "2024-06-20",
  httpClient: Stripe.createFetchHttpClient(),
});

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;

    // Identify the caller from their JWT.
    const userClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: userErr } = await userClient.auth.getUser();
    if (userErr || !user) return json({ error: "Not authenticated." }, 401);

    const { successUrl, cancelUrl, billingCycle } = await req.json();
    if (!successUrl || !cancelUrl) return json({ error: "Missing redirect URLs." }, 400);

    // Pick the Stripe price for the requested cycle. Falls back to the monthly
    // price if a yearly price hasn't been created yet, so checkout never breaks.
    const monthlyPrice = Deno.env.get("STRIPE_AGENCY_PRICE_ID");
    const yearlyPrice = Deno.env.get("STRIPE_AGENCY_YEARLY_PRICE_ID");
    const priceId = billingCycle === "yearly" ? (yearlyPrice ?? monthlyPrice) : monthlyPrice;
    if (!priceId) return json({ error: "Stripe Agency price is not configured." }, 500);

    // Service-role client for reading/writing the subscription row.
    const admin = createClient(supabaseUrl, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { data: sub } = await admin
      .from("subscriptions")
      .select("provider_customer_id")
      .eq("user_id", user.id)
      .maybeSingle();

    // Reuse or create a Stripe customer so the billing portal works later.
    let customerId = sub?.provider_customer_id ?? undefined;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { user_id: user.id },
      });
      customerId = customer.id;
      await admin
        .from("subscriptions")
        .update({ provider: "stripe", provider_customer_id: customerId })
        .eq("user_id", user.id);
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: { user_id: user.id },
      subscription_data: { metadata: { user_id: user.id } },
      allow_promotion_codes: true,
    });

    return json({ url: session.url });
  } catch (err) {
    console.error("subscribe-stripe error:", err);
    return json({ error: (err as Error).message }, 500);
  }
});
