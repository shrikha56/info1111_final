// Script to insert properties into the Supabase properties table
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Create Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('Supabase URL:', supabaseUrl ? 'Set (hidden for security)' : 'Not set');
console.log('Supabase Key:', supabaseKey ? 'Set (hidden for security)' : 'Not set');

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL or key is missing. Make sure to set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Sample property data to insert
const properties = [
  {
    unit_number: '101',
    address: '123 Sunset Blvd, Sydney, Unit 101'
  },
  {
    unit_number: '102',
    address: '123 Sunset Blvd, Sydney, Unit 102'
  },
  {
    unit_number: '103',
    address: '45 Harbour St, Sydney, Unit 103'
  }
];

async function insertProperties() {
  try {
    console.log('Inserting properties into Supabase...');
    
    // Insert the properties
    const { data, error } = await supabase
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
