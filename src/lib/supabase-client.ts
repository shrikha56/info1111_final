import { createClient } from '@supabase/supabase-js';

// Create a singleton instance
let supabaseInstance: ReturnType<typeof createClient> | null = null;

export function getSupabaseClient() {
  if (!supabaseInstance) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase credentials');
    }
    
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false }
    });
  }
  return supabaseInstance;
}

// Export a default instance for convenience
export default getSupabaseClient(); 