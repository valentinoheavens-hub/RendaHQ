import { supabase } from './supabase';

export interface Client {
  id: string;
  user_id?: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  company?: string | null;
  status: 'Active' | 'Inactive' | 'Onboarding';
  notes?: string | null;
  created_at: string;
  updated_at?: string;
}

export const clientStore = {
  async getAll(): Promise<Client[]> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []) as Client[];
  },

  async getById(id: string): Promise<Client | null> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();
    if (error) return null;
    return data as Client;
  },

  async create(fields: Omit<Client, 'id' | 'created_at' | 'user_id' | 'updated_at'>): Promise<Client> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    const { data, error } = await supabase
      .from('clients')
      .insert({ ...fields, user_id: user.id })
      .select()
      .single();
    if (error) throw error;
    return data as Client;
  },

  async update(id: string, patch: Partial<Omit<Client, 'id' | 'user_id' | 'created_at'>>): Promise<Client | null> {
    const { data, error } = await supabase
      .from('clients')
      .update(patch)
      .eq('id', id)
      .select()
      .single();
    if (error) return null;
    return data as Client;
  },

  async remove(id: string): Promise<void> {
    await supabase.from('clients').delete().eq('id', id);
  },
};
