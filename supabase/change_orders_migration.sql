-- ============================================================
-- RendaHQ — Scope Change Orders (Agency+ feature)
-- Backs the "Scope change orders" line in the Agency plan.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.change_orders (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  project_id      UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  project_name    TEXT NOT NULL DEFAULT '',
  client_name     TEXT NOT NULL DEFAULT '',
  title           TEXT NOT NULL,
  description     TEXT DEFAULT '',
  amount          NUMERIC(12,2) DEFAULT 0,
  timeline_impact TEXT DEFAULT '',
  client_message  TEXT DEFAULT '',
  status          TEXT DEFAULT 'Draft' CHECK (status IN ('Draft','Sent','Approved','Declined')),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.change_orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "change_orders_select" ON public.change_orders;
DROP POLICY IF EXISTS "change_orders_insert" ON public.change_orders;
DROP POLICY IF EXISTS "change_orders_update" ON public.change_orders;
DROP POLICY IF EXISTS "change_orders_delete" ON public.change_orders;
CREATE POLICY "change_orders_select" ON public.change_orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "change_orders_insert" ON public.change_orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "change_orders_update" ON public.change_orders FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "change_orders_delete" ON public.change_orders FOR DELETE USING (auth.uid() = user_id);

DROP TRIGGER IF EXISTS set_updated_at_change_orders ON public.change_orders;
CREATE TRIGGER set_updated_at_change_orders
  BEFORE UPDATE ON public.change_orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ─── Notifications on send / approval ────────────────────────
CREATE OR REPLACE FUNCTION public.handle_change_order_notification() RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.status = 'Sent' THEN
      PERFORM public.create_notification(
        NEW.user_id, 'change_order_sent',
        'Change order sent',
        '"' || NEW.title || '" was sent to ' || COALESCE(NULLIF(NEW.client_name, ''), 'the client') || '.',
        jsonb_build_object('change_order_id', NEW.id, 'project_id', NEW.project_id)
      );
    END IF;
    RETURN NEW;
  END IF;

  IF NEW.status = 'Sent' AND OLD.status IS DISTINCT FROM 'Sent' THEN
    PERFORM public.create_notification(
      NEW.user_id, 'change_order_sent',
      'Change order sent',
      '"' || NEW.title || '" was sent to ' || COALESCE(NULLIF(NEW.client_name, ''), 'the client') || '.',
      jsonb_build_object('change_order_id', NEW.id, 'project_id', NEW.project_id)
    );
  ELSIF NEW.status = 'Approved' AND OLD.status IS DISTINCT FROM 'Approved' THEN
    PERFORM public.create_notification(
      NEW.user_id, 'change_order_approved',
      'Change order approved',
      '"' || NEW.title || '" was approved by ' || COALESCE(NULLIF(NEW.client_name, ''), 'the client') || '.',
      jsonb_build_object('change_order_id', NEW.id, 'project_id', NEW.project_id)
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

DROP TRIGGER IF EXISTS on_change_order_notification ON public.change_orders;
CREATE TRIGGER on_change_order_notification
  AFTER INSERT OR UPDATE OF status ON public.change_orders
  FOR EACH ROW EXECUTE FUNCTION public.handle_change_order_notification();
