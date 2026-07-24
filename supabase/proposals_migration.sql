-- ============================================================
-- RendaHQ — Proposals + Branding + Logo storage
-- Already applied to the live project
-- (migrations: proposals_branding_storage, harden_logos_bucket_listing)
-- ============================================================

-- ─── Proposals (previously mock-only in the UI) ───────────────
CREATE TABLE IF NOT EXISTS public.proposals (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  client_id     UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  title         TEXT NOT NULL,
  client_name   TEXT NOT NULL DEFAULT '',
  status        TEXT DEFAULT 'Draft' CHECK (status IN ('Draft','Sent','Accepted','Declined')),
  content       TEXT DEFAULT '',
  items         JSONB DEFAULT '[]',
  total         NUMERIC(12,2) DEFAULT 0,
  currency_code TEXT DEFAULT 'USD',
  valid_until   DATE,
  terms         TEXT DEFAULT '',
  brief         JSONB DEFAULT '{}',   -- intake + AI discovery-interview Q&A
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "proposals_select" ON public.proposals;
DROP POLICY IF EXISTS "proposals_insert" ON public.proposals;
DROP POLICY IF EXISTS "proposals_update" ON public.proposals;
DROP POLICY IF EXISTS "proposals_delete" ON public.proposals;
CREATE POLICY "proposals_select" ON public.proposals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "proposals_insert" ON public.proposals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "proposals_update" ON public.proposals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "proposals_delete" ON public.proposals FOR DELETE USING (auth.uid() = user_id);

DROP TRIGGER IF EXISTS set_updated_at_proposals ON public.proposals;
CREATE TRIGGER set_updated_at_proposals
  BEFORE UPDATE ON public.proposals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ─── Branding fields used by Settings / invoices / proposals ──
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS brand_color TEXT DEFAULT '#059669';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS logo_url TEXT;

-- ─── Logo storage ─────────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public) VALUES ('logos','logos', true)
ON CONFLICT (id) DO NOTHING;

-- Writes restricted to the user's own folder (`${uid}/…`). No broad SELECT
-- policy: a public bucket already serves objects by URL, and a broad policy
-- would let clients enumerate every user's logo.
DROP POLICY IF EXISTS "logos_public_read"  ON storage.objects;
DROP POLICY IF EXISTS "logos_owner_list"   ON storage.objects;
DROP POLICY IF EXISTS "logos_owner_insert" ON storage.objects;
DROP POLICY IF EXISTS "logos_owner_update" ON storage.objects;
DROP POLICY IF EXISTS "logos_owner_delete" ON storage.objects;
CREATE POLICY "logos_owner_list" ON storage.objects
  FOR SELECT USING (bucket_id = 'logos' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "logos_owner_insert" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'logos' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "logos_owner_update" ON storage.objects
  FOR UPDATE USING (bucket_id = 'logos' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "logos_owner_delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'logos' AND auth.uid()::text = (storage.foldername(name))[1]);
