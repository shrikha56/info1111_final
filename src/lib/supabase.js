import { createClient } from '@supabase/supabase-js';

// Create a single supabase client for interacting with your database
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Debug environment variables (only in development)
if (process.env.NODE_ENV === 'development') {
  console.log('Supabase URL:', supabaseUrl ? 'Set (hidden for security)' : 'Not set');
  console.log('Supabase Key:', supabaseKey ? 'Set (hidden for security)' : 'Not set');
}

if (!supabaseUrl || !supabaseKey) {
  console.warn(
    'Supabase URL or key is missing. Make sure to set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.'
  );
}

// Create client with additional options
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  },
})

export default supabase;
