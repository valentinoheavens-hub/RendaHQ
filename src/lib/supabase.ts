import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// We check if the credentials exist. If not, we use placeholders to prevent the app from crashing,
// although Supabase features won't work until the real credentials are loaded.
const isConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isConfigured) {
  console.warn("Supabase credentials missing. Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set. You may need to Rebuild the app.");
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder-project.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);