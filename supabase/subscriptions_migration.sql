-- ============================================================
-- RendaHQ — Subscriptions Migration (platform billing)
-- Run AFTER schema.sql in: Supabase Dashboard → SQL Editor → New Query
-- Charges freelancers for RendaHQ itself (Agency plan).
-- ============================================================

-- ─── Subscriptions (one row per user) ────────────────────────
CREATE TABLE IF NOT EXISTS subscriptions (
  id                       UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id                  UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  plan                     TEXT NOT NULL DEFAULT 'agency'
                             CHECK (plan IN ('free', 'agency', 'enterprise')),
  status                   TEXT NOT NULL DEFAULT 'trialing'
                             CHECK (status IN ('trialing', 'active', 'past_due', 'canceled', 'free')),
  provider                 TEXT CHECK (provider IN ('stripe', 'paystack', 'flutterwave')),
  provider_customer_id     TEXT,
  provider_subscription_id TEXT,
  trial_ends_at            TIMESTAMPTZ,
  current_period_end       TIMESTAMPTZ,
  created_at               TIMESTAMPTZ DEFAULT NOW(),
  updated_at               TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS subscriptions_user_id_idx ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS subscriptions_provider_sub_idx ON subscriptions(provider_subscription_id);

-- ─── Row Level Security ───────────────────────────────────────
-- Users may READ their own subscription only. All WRITES happen via
-- the signup trigger (SECURITY DEFINER) or Edge Functions using the
-- service role key — so a user can never self-upgrade without paying.
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "subscriptions_select" ON subscriptions;
CREATE POLICY "subscriptions_select" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);
-- (No INSERT/UPDATE/DELETE policies for end users on purpose.)

-- ─── Grant every new user a 14-day Agency trial (no card) ─────
-- Extends the existing handle_new_user() from schema.sql so signup
-- also seeds a trialing subscription.
-- SECURITY DEFINER with a pinned empty search_path (schema-qualify all refs)
-- to prevent search_path-based privilege escalation.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.subscriptions (user_id, plan, status, trial_ends_at)
  VALUES (NEW.id, 'agency', 'trialing', NOW() + INTERVAL '14 days')
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

-- Only fire via the trigger below — never as a public RPC endpoint.
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

-- Trigger already created in schema.sql (on_auth_user_created); re-bind to be safe.
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ─── Backfill: give existing users a trial row if missing ────
INSERT INTO subscriptions (user_id, plan, status, trial_ends_at)
SELECT p.id, 'agency', 'trialing', NOW() + INTERVAL '14 days'
FROM profiles p
LEFT JOIN subscriptions s ON s.user_id = p.id
WHERE s.id IS NULL;

-- ─── updated_at trigger ──────────────────────────────────────
DROP TRIGGER IF EXISTS set_updated_at_subscriptions ON subscriptions;
CREATE TRIGGER set_updated_at_subscriptions
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
