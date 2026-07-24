import { supabase } from './supabase';

export interface Profile {
  id: string;
  email?: string | null;
  full_name?: string | null;
  agency_name?: string | null;
  currency_code?: string | null;
  brand_color?: string | null;
  logo_url?: string | null;
  onboarding_completed?: boolean;
  services?: string[];
  created_at?: string;
  updated_at?: string;
}

export const profileStore = {
  async get(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) return null;
    return data as Profile;
  },

  // Public white-label branding (name, colour, logo) for any owner — readable
  // by clients/anon via a SECURITY DEFINER RPC, so client-facing pages can show
  // the freelancer's brand even when RLS blocks reading the full profile.
  async getBranding(userId: string): Promise<Pick<Profile, 'agency_name' | 'brand_color' | 'logo_url'> | null> {
    const { data, error } = await supabase.rpc('get_agency_branding', { uid: userId });
    if (error || !data || (Array.isArray(data) && data.length === 0)) return null;
    return (Array.isArray(data) ? data[0] : data) as Profile;
  },

  async update(userId: string, patch: Partial<Omit<Profile, 'id' | 'created_at'>>): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .update(patch)
      .eq('id', userId)
      .select()
      .single();
    if (error) throw error;
    return data as Profile;
  },

  // Uploads to the public `logos` bucket under the user's own folder
  // (storage RLS restricts writes to `${uid}/…`). Returns the public URL.
  async uploadLogo(userId: string, file: File): Promise<string> {
    const ext = file.name.split('.').pop()?.toLowerCase() || 'png';
    const path = `${userId}/logo-${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from('logos')
      .upload(path, file, { upsert: true, contentType: file.type });
    if (error) throw error;
    const { data } = supabase.storage.from('logos').getPublicUrl(path);
    return data.publicUrl;
  },
};
