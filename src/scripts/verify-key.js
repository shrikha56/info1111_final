// Script to verify the Supabase service role key
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// The URL from the screenshot
const supabaseUrl = 'https://jsljlojidfkigqfaqscy.supabase.co';

// The service role key from the screenshot (copied directly)
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpzbGpsb2ppZGZraWdxZmFxc2N5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NTgwNzQ0NywiZXhwIjoyMDYxMzgzNDQ3fQ.Oe3Yc_1Vn2XOvYZnTIrwdLZBDnmKrGKG5PIxVJGXwSA';

// Create Supabase client with hardcoded service role key
const supabase = createClient(supabaseUrl, serviceRoleKey);

// Test function to check if we can connect to Supabase
async function testConnection() {
  try {
    console.log('Testing Supabase connection with hardcoded key...');
    
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
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the test
testConnection();
