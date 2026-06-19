-- ============================================================
-- RendaHQ — Projects Migration
-- Run in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

CREATE TABLE IF NOT EXISTS projects (
  id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id        UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  client_id      UUID REFERENCES clients(id) ON DELETE SET NULL,
  name           TEXT NOT NULL,
  client_name    TEXT NOT NULL DEFAULT '',
  description    TEXT DEFAULT '',
  status         TEXT DEFAULT 'Active' CHECK (status IN ('Active','In Progress','Under Review','Completed','Onboarding','On Hold','Cancelled')),
  progress       INT DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  health         TEXT DEFAULT 'Healthy' CHECK (health IN ('Healthy','At Risk','Off Track')),
  budget         NUMERIC(12,2) DEFAULT 0,
  spent          NUMERIC(12,2) DEFAULT 0,
  billing_method TEXT DEFAULT 'Fixed' CHECK (billing_method IN ('Fixed','Hourly','Retainer')),
  due_date       DATE,
  milestones     JSONB DEFAULT '[]',
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "projects_select" ON projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "projects_insert" ON projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "projects_update" ON projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "projects_delete" ON projects FOR DELETE USING (auth.uid() = user_id);

DROP TRIGGER IF EXISTS set_updated_at_projects ON projects;
CREATE TRIGGER set_updated_at_projects
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
