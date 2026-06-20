// Sends email via Resend, server-side. The RESEND_API_KEY stays here and never
// reaches the browser. verify_jwt is enabled, so only authenticated RendaHQ
// users can trigger sends (prevents open-relay abuse).
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
    const apiKey = Deno.env.get("RESEND_API_KEY");
    if (!apiKey) return json({ error: "Email service is not configured." }, 500);

    const { to, subject, body, fromName, replyTo } = await req.json();
    if (!to || !subject || !body) {
      return json({ error: "Missing to, subject, or body." }, 400);
    }

    // Default sender; override with a verified domain address via RESEND_FROM.
    const defaultFrom = Deno.env.get("RESEND_FROM") ?? "onboarding@resend.dev";
    const from = fromName ? `${fromName} <${defaultFrom}>` : defaultFrom;

    const html = String(body).includes("<")
      ? body
      : `<p style="font-family:sans-serif;line-height:1.6">${String(body).replace(/\n/g, "<br/>")}</p>`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
        reply_to: replyTo,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      return json({ error: data?.message ?? "Resend send failed." }, 502);
    }
    return json({ success: true, id: data?.id });
  } catch (err) {
    console.error("send-email error:", err);
    return json({ error: (err as Error).message }, 500);
  }
});
