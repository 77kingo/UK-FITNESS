import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Export a flag to check if the app is running in mock mode
export const isMockMode = !supabaseUrl || !supabaseAnonKey;

if (isMockMode) {
  console.warn(
    'UK FITNESS: Supabase environment variables are missing. Running in MOCK mode with local state storage.'
  );
}

// Client will be created. If variables are empty, we initialize with placeholder URLs to prevent crashes.
export const supabase = createClient(
  supabaseUrl || 'https://placeholder-url.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key'
);
