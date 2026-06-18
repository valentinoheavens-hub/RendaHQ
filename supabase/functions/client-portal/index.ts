import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const clientId = url.searchParams.get("clientId");

  if (!clientId) {
    return new Response(JSON.stringify({ error: "Missing clientId" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  const { data: client, error: clientErr } = await supabase
    .from("clients")
    .select("id, name, company, email")
    .eq("id", clientId)
    .single();

  if (clientErr || !client) {
    return new Response(JSON.stringify({ error: "Client not found" }), {
      status: 404,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const [invoicesRes, contractsRes, projectsRes] = await Promise.all([
    supabase
      .from("invoices")
      .select("id, invoice_number, amount, status, due_date, created_at, items, notes")
      .eq("client_id", clientId)
      .order("created_at", { ascending: false }),
    supabase
      .from("contracts")
      .select("id, title, status, service_type, value, created_at")
      .eq("client_id", clientId)
      .order("created_at", { ascending: false }),
    supabase
      .from("projects")
      .select("id, name, status, progress, due_date, milestones, health")
      .eq("client_id", clientId)
      .order("created_at", { ascending: false }),
  ]);

  return new Response(
    JSON.stringify({
      client,
      invoices: invoicesRes.data ?? [],
      contracts: contractsRes.data ?? [],
      projects: projectsRes.data ?? [],
    }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
});
