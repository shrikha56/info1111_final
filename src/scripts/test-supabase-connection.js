// Script to test the Supabase connection with the service role key
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('Supabase URL:', supabaseUrl ? 'Set (hidden for security)' : 'Not set');
console.log('Supabase Service Key:', supabaseServiceKey ? 'Set (hidden for security)' : 'Not set');

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Supabase URL or service key is missing. Make sure to set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.');
  process.exit(1);
}

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Test function to check if we can connect to Supabase
async function testConnection() {
  try {
    console.log('Testing Supabase connection...');
    
    // Try to get a list of all tables (requires service role key)
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Error connecting to Supabase:', error);
      return;
    }
    
    console.log('Successfully connected to Supabase!');
    console.log('Properties data:', data);
    
    // Test if we can query other tables
    const { data: tablesData, error: tablesError } = await supabase
      .rpc('get_tables');
    
    if (tablesError) {
      console.log('Could not get tables list, but connection was successful');
    } else {
      console.log('Available tables:', tablesData);
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the test
testConnection();
