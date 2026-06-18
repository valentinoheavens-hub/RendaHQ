import { supabase } from './supabase';

export interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface Invoice {
  id: string;
  user_id?: string;
  client_id?: string | null;
  invoice_number: string;
  client_name: string;
  amount: number;
  status: 'Draft' | 'Sent' | 'Paid' | 'Overdue' | 'Cancelled';
  due_date?: string | null;
  payment_method?: string | null;
  paystack_reference?: string | null;
  paystack_access_code?: string | null;
  paid_at?: string | null;
  items: InvoiceItem[];
  notes?: string | null;
  created_at: string;
  updated_at?: string;
}

export const invoiceStore = {
  async getAll(): Promise<Invoice[]> {
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []) as Invoice[];
  },

  async getById(id: string): Promise<Invoice | null> {
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', id)
      .single();
    if (error) return null;
    return data as Invoice;
  },

  async create(fields: Omit<Invoice, 'id' | 'created_at' | 'user_id' | 'updated_at'>): Promise<Invoice> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    const { data, error } = await supabase
      .from('invoices')
      .insert({ ...fields, user_id: user.id })
      .select()
      .single();
    if (error) throw error;
    return data as Invoice;
  },

  async update(id: string, patch: Partial<Omit<Invoice, 'id' | 'user_id' | 'created_at'>>): Promise<Invoice | null> {
    const { data, error } = await supabase
      .from('invoices')
      .update(patch)
      .eq('id', id)
      .select()
      .single();
    if (error) return null;
    return data as Invoice;
  },

  async remove(id: string): Promise<void> {
    await supabase.from('invoices').delete().eq('id', id);
  },

  async nextInvoiceNumber(): Promise<string> {
    const { count } = await supabase
      .from('invoices')
      .select('*', { count: 'exact', head: true });
    const n = (count ?? 0) + 1;
    return `INV-${String(n).padStart(3, '0')}`;
  },
};
