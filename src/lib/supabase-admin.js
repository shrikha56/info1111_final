import { createClient } from '@supabase/supabase-js';

// Create a single supabase client for interacting with your database with admin privileges
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Use only the service role key, don't fall back to anon key
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Debug environment variables (only in development)
if (process.env.NODE_ENV === 'development') {
  console.log('Supabase Admin URL:', supabaseUrl ? 'Set (hidden for security)' : 'Not set');
  console.log('Supabase Service Key:', supabaseServiceKey ? 'Set (hidden for security)' : 'Not set');
}

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn(
    'Supabase URL or service key is missing. Make sure to set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.'
  );
}

// Create admin client with service role credentials
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  },
});

export default supabaseAdmin;
