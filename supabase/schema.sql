-- ============================================================
-- RendaHQ — Supabase Schema
-- Run this entire file in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- ─── Extensions ──────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Profiles (auto-created on signup) ───────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id             UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email          TEXT,
  full_name      TEXT,
  agency_name    TEXT DEFAULT 'My Agency',
  currency_code  TEXT DEFAULT 'USD',
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Clients ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS clients (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name        TEXT NOT NULL,
  email       TEXT,
  phone       TEXT,
  company     TEXT,
  status      TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Onboarding')),
  notes       TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Contracts ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS contracts (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  client_id     UUID REFERENCES clients(id) ON DELETE SET NULL,
  title         TEXT NOT NULL,
  client        TEXT NOT NULL,
  status        TEXT DEFAULT 'Draft' CHECK (status IN ('Draft', 'Sent', 'Signed', 'Cancelled')),
  content       TEXT DEFAULT '',
  service_type  TEXT DEFAULT 'General',
  value         TEXT DEFAULT '0',
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Invoices ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS invoices (
  id                   UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id              UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  client_id            UUID REFERENCES clients(id) ON DELETE SET NULL,
  invoice_number       TEXT NOT NULL,
  client_name          TEXT NOT NULL,
  amount               NUMERIC(12,2) NOT NULL DEFAULT 0,
  status               TEXT DEFAULT 'Draft' CHECK (status IN ('Draft', 'Sent', 'Paid', 'Overdue', 'Cancelled')),
  due_date             DATE,
  payment_method       TEXT,
  paystack_reference   TEXT,
  paystack_access_code TEXT,
  paid_at              TIMESTAMPTZ,
  items                JSONB DEFAULT '[]',
  notes                TEXT,
  created_at           TIMESTAMPTZ DEFAULT NOW(),
  updated_at           TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Row Level Security ───────────────────────────────────────
ALTER TABLE profiles  ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients   ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices  ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "profiles_select" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Clients
CREATE POLICY "clients_select" ON clients FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "clients_insert" ON clients FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "clients_update" ON clients FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "clients_delete" ON clients FOR DELETE USING (auth.uid() = user_id);

-- Contracts
CREATE POLICY "contracts_select" ON contracts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "contracts_insert" ON contracts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "contracts_update" ON contracts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "contracts_delete" ON contracts FOR DELETE USING (auth.uid() = user_id);

-- Invoices
CREATE POLICY "invoices_select" ON invoices FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "invoices_insert" ON invoices FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "invoices_update" ON invoices FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "invoices_delete" ON invoices FOR DELETE USING (auth.uid() = user_id);

-- ─── Auto-create profile on signup ───────────────────────────
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ─── updated_at triggers ─────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at_profiles  ON profiles;
DROP TRIGGER IF EXISTS set_updated_at_clients   ON clients;
DROP TRIGGER IF EXISTS set_updated_at_contracts ON contracts;
DROP TRIGGER IF EXISTS set_updated_at_invoices  ON invoices;

CREATE TRIGGER set_updated_at_profiles  BEFORE UPDATE ON profiles  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at_clients   BEFORE UPDATE ON clients   FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at_contracts BEFORE UPDATE ON contracts FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at_invoices  BEFORE UPDATE ON invoices  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
