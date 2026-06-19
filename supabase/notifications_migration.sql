-- ============================================================
-- RendaHQ — Notifications Migration
-- Run in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- ─── Notifications table ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type        TEXT NOT NULL,
  title       TEXT NOT NULL,
  message     TEXT,
  read        BOOLEAN DEFAULT FALSE,
  data        JSONB DEFAULT '{}',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notifications_select" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "notifications_insert" ON notifications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "notifications_update" ON notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "notifications_delete" ON notifications FOR DELETE USING (auth.uid() = user_id);

-- ─── Helper function ─────────────────────────────────────────
CREATE OR REPLACE FUNCTION create_notification(
  p_user_id UUID,
  p_type    TEXT,
  p_title   TEXT,
  p_message TEXT,
  p_data    JSONB DEFAULT '{}'
) RETURNS void AS $$
BEGIN
  INSERT INTO notifications (user_id, type, title, message, data)
  VALUES (p_user_id, p_type, p_title, p_message, p_data);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ─── Invoice trigger ─────────────────────────────────────────
CREATE OR REPLACE FUNCTION handle_invoice_notification() RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'Paid' AND (OLD.status IS NULL OR OLD.status <> 'Paid') THEN
    PERFORM create_notification(
      NEW.user_id, 'invoice_paid',
      'Payment received',
      'Invoice ' || NEW.invoice_number || ' from ' || NEW.client_name || ' has been paid.',
      jsonb_build_object('invoice_id', NEW.id, 'invoice_number', NEW.invoice_number)
    );
  END IF;
  IF NEW.status = 'Overdue' AND (OLD.status IS NULL OR OLD.status <> 'Overdue') THEN
    PERFORM create_notification(
      NEW.user_id, 'invoice_overdue',
      'Invoice overdue',
      'Invoice ' || NEW.invoice_number || ' from ' || NEW.client_name || ' is now overdue.',
      jsonb_build_object('invoice_id', NEW.id)
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_invoice_notification ON invoices;
CREATE TRIGGER on_invoice_notification
  AFTER UPDATE OF status ON invoices
  FOR EACH ROW EXECUTE FUNCTION handle_invoice_notification();

-- ─── Contract trigger ─────────────────────────────────────────
CREATE OR REPLACE FUNCTION handle_contract_notification() RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'Signed' AND (OLD.status IS NULL OR OLD.status <> 'Signed') THEN
    PERFORM create_notification(
      NEW.user_id, 'contract_signed',
      'Contract signed',
      '"' || NEW.title || '" has been signed by ' || NEW.client || '.',
      jsonb_build_object('contract_id', NEW.id)
    );
  END IF;
  IF NEW.status = 'Sent' AND (OLD.status IS NULL OR OLD.status <> 'Sent') THEN
    PERFORM create_notification(
      NEW.user_id, 'contract_sent',
      'Contract sent',
      '"' || NEW.title || '" has been sent to ' || NEW.client || '.',
      jsonb_build_object('contract_id', NEW.id)
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_contract_notification ON contracts;
CREATE TRIGGER on_contract_notification
  AFTER UPDATE OF status ON contracts
  FOR EACH ROW EXECUTE FUNCTION handle_contract_notification();

-- ─── New client trigger ───────────────────────────────────────
CREATE OR REPLACE FUNCTION handle_new_client_notification() RETURNS TRIGGER AS $$
BEGIN
  PERFORM create_notification(
    NEW.user_id, 'new_client',
    'New client added',
    NEW.name || ' has been added to your workspace.',
    jsonb_build_object('client_id', NEW.id)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_new_client_notification ON clients;
CREATE TRIGGER on_new_client_notification
  AFTER INSERT ON clients
  FOR EACH ROW EXECUTE FUNCTION handle_new_client_notification();

-- Enable realtime for notifications table
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
