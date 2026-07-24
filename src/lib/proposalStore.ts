import { supabase } from './supabase';

export interface ProposalItem {
  id: number;
  description: string;
  amount: number;
}

// The intake brief + the AI interview Q&A, kept for regeneration/audit.
export interface ProposalBrief {
  projectType?: string;
  scope?: string;
  budget?: string;
  questions?: { question: string; answer: string }[];
}

export interface Proposal {
  id: string;
  user_id?: string;
  client_id?: string | null;
  title: string;
  client_name: string;
  status: 'Draft' | 'Sent' | 'Accepted' | 'Declined';
  content: string;
  items: ProposalItem[];
  total: number;
  currency_code: string;
  valid_until?: string | null;
  terms: string;
  brief: ProposalBrief;
  created_at: string;
  updated_at?: string;
}

export type ProposalInsert = Omit<Proposal, 'id' | 'user_id' | 'created_at' | 'updated_at'>;

export const proposalStore = {
  async getAll(): Promise<Proposal[]> {
    const { data, error } = await supabase
      .from('proposals')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []) as Proposal[];
  },

  async getById(id: string): Promise<Proposal | null> {
    const { data, error } = await supabase
      .from('proposals')
      .select('*')
      .eq('id', id)
      .single();
    if (error) return null;
    return data as Proposal;
  },

  async create(fields: ProposalInsert): Promise<Proposal> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    const { data, error } = await supabase
      .from('proposals')
      .insert({ ...fields, user_id: user.id })
      .select()
      .single();
    if (error) throw error;
    return data as Proposal;
  },

  async update(id: string, patch: Partial<ProposalInsert>): Promise<Proposal | null> {
    const { data, error } = await supabase
      .from('proposals')
      .update(patch)
      .eq('id', id)
      .select()
      .single();
    if (error) return null;
    return data as Proposal;
  },

  async remove(id: string): Promise<void> {
    await supabase.from('proposals').delete().eq('id', id);
  },
};
