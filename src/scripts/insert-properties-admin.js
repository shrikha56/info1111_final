// Script to insert properties using the Supabase admin client to bypass RLS policies
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Create Supabase admin client with service role key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('Supabase URL:', supabaseUrl ? 'Set (hidden for security)' : 'Not set');
console.log('Supabase Service Key:', supabaseKey ? 'Set (hidden for security)' : 'Not set');

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL or service key is missing. Make sure to set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.');
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

// Properties to insert
const properties = [
  {
    unit_number: '101',
    address: '123 Sunset Blvd, Sydney, Unit 101'
  },
  {
    unit_number: '102',
    address: '45 Harbour St, Sydney, Unit 102'
  },
  {
    unit_number: '103',
    address: '78 Park Lane, Sydney, Unit 103'
  }
];

async function insertProperties() {
  try {
    console.log('Inserting properties into Supabase using admin client...');
    
    // Insert the properties
    const { data, error } = await supabaseAdmin
      .from('properties')
      .insert(properties)
      .select();
    
    if (error) {
      console.error('Error inserting properties:', error);
      return;
    }
    
    console.log('Successfully inserted properties:', data);
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the function
insertProperties();
