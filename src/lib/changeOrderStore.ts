import { supabase } from './supabase';

export type ChangeOrderStatus = 'Draft' | 'Sent' | 'Approved' | 'Declined';

export interface ChangeOrder {
  id: string;
  user_id?: string;
  project_id?: string | null;
  project_name: string;
  client_name: string;
  title: string;
  description: string;
  amount: number;
  timeline_impact: string;
  client_message: string;
  status: ChangeOrderStatus;
  created_at: string;
  updated_at?: string;
}

export type ChangeOrderInsert = Omit<
  ChangeOrder,
  'id' | 'user_id' | 'created_at' | 'updated_at'
>;

export const changeOrderStore = {
  async getAll(): Promise<ChangeOrder[]> {
    const { data, error } = await supabase
      .from('change_orders')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) { console.error(error); return []; }
    return (data ?? []) as ChangeOrder[];
  },

  async getByProject(projectId: string): Promise<ChangeOrder[]> {
    const { data, error } = await supabase
      .from('change_orders')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });
    if (error) { console.error(error); return []; }
    return (data ?? []) as ChangeOrder[];
  },

  async getById(id: string): Promise<ChangeOrder | null> {
    const { data, error } = await supabase
      .from('change_orders')
      .select('*')
      .eq('id', id)
      .single();
    if (error) { console.error(error); return null; }
    return data as ChangeOrder;
  },

  async create(fields: ChangeOrderInsert): Promise<ChangeOrder | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { console.error('Not authenticated'); return null; }
    const { data, error } = await supabase
      .from('change_orders')
      .insert({ ...fields, user_id: user.id })
      .select()
      .single();
    if (error) { console.error(error); throw error; }
    return data as ChangeOrder;
  },

  async update(id: string, patch: Partial<ChangeOrderInsert>): Promise<ChangeOrder | null> {
    const { data, error } = await supabase
      .from('change_orders')
      .update(patch)
      .eq('id', id)
      .select()
      .single();
    if (error) { console.error(error); return null; }
    return data as ChangeOrder;
  },

  async remove(id: string): Promise<void> {
    await supabase.from('change_orders').delete().eq('id', id);
  },
};
