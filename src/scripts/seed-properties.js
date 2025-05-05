// Script to seed the properties table in Supabase
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Create Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL or key is missing. Make sure to set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Sample property data to insert
const properties = [
  {
    property_id: 'prop-001',
    property_name: 'Sunset Heights',
    property_address: '123 Sunset Blvd, Sydney, NSW 2000',
    unit_count: 24,
    maintenance_count: 3,
    last_inspection_date: '2025-04-15'
  },
  {
    property_id: 'prop-002',
    property_name: 'Harbour View Apartments',
    property_address: '45 Harbour St, Sydney, NSW 2000',
    unit_count: 36,
    maintenance_count: 5,
    last_inspection_date: '2025-04-22'
  },
  {
    property_id: 'prop-003',
    property_name: 'Parkside Residences',
    property_address: '78 Park Lane, Sydney, NSW 2010',
    unit_count: 18,
    maintenance_count: 1,
    last_inspection_date: '2025-04-28'
  }
];

async function seedProperties() {
  try {
    console.log('Seeding properties table...');
    
    // First, check if the table exists
    const { data: tableInfo, error: tableError } = await supabase
      .from('properties')
      .select('*')
      .limit(1);
    
    if (tableError) {
      console.error('Error checking properties table:', tableError);
      return;
    }
    
    // Insert the properties
    const { data, error } = await supabase
      .from('properties')
      .upsert(properties, { onConflict: 'property_id' });
    
    if (error) {
      console.error('Error inserting properties:', error);
      return;
    }
    
    console.log('Successfully seeded properties table!');
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the seed function
seedProperties();
