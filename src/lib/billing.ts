import { supabase } from "@/lib/supabase";
import type { Provider } from "@/lib/plans";

export interface CheckoutResult {
  url?: string;
  error?: string;
}

// Maps a provider to its Supabase Edge Function name.
const FUNCTION_FOR: Partial<Record<Provider, string>> = {
  stripe: "subscribe-stripe",
  flutterwave: "subscribe-flutterwave",
};

// Kicks off a subscription checkout. The edge function identifies the user
// from their auth JWT (added automatically by supabase.functions.invoke),
// creates the recurring checkout provider-side, and returns a redirect URL.
export async function startSubscription(provider: Provider): Promise<CheckoutResult> {
  const fn = FUNCTION_FOR[provider];
  if (!fn) return { error: "This payment method isn't available yet." };

  const origin = window.location.origin;
  try {
    const { data, error } = await supabase.functions.invoke(fn, {
      body: {
        successUrl: `${origin}/billing?status=success`,
        cancelUrl: `${origin}/billing?status=cancelled`,
        callbackUrl: `${origin}/billing?status=success`,
        // Flutterwave appends its own ?status=successful|cancelled, so send a clean URL.
        redirectUrl: `${origin}/billing`,
      },
    });

    if (error) return { error: error.message };
    if (data?.url) return { url: data.url as string };
    return { error: data?.error || "Could not start checkout. Please try again." };
  } catch (err) {
    return { error: (err as Error).message ?? "Checkout failed." };
  }
}

// Opens the provider's billing-management portal (Stripe only for now).
export async function openBillingPortal(): Promise<CheckoutResult> {
  const origin = window.location.origin;
  try {
    const { data, error } = await supabase.functions.invoke("billing-portal", {
      body: { returnUrl: `${origin}/billing` },
    });
    if (error) return { error: error.message };
    if (data?.url) return { url: data.url as string };
    return { error: data?.error || "Could not open the billing portal." };
  } catch (err) {
    return { error: (err as Error).message ?? "Failed to open portal." };
  }
}
