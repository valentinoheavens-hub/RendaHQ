-- ============================================================
-- RendaHQ — Onboarding Migration
-- Run in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS services             TEXT[]  DEFAULT '{}';
