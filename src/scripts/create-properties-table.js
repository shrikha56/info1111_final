// Script to create the properties table in Supabase with the correct structure
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Create Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL or key is missing. Make sure to set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createPropertiesTable() {
  try {
    console.log('Creating properties table...');
    
    // SQL to create the properties table
    const { error } = await supabase.rpc('create_properties_table', {
      sql: `
        CREATE TABLE IF NOT EXISTS properties (
          id SERIAL PRIMARY KEY,
          property_id TEXT UNIQUE NOT NULL,
          property_name TEXT NOT NULL,
          property_address TEXT NOT NULL,
          unit_count INTEGER NOT NULL,
          maintenance_count INTEGER NOT NULL,
          last_inspection_date DATE NOT NULL
        );
      `
    });
    
    if (error) {
      console.error('Error creating properties table:', error);
      return;
    }
    
    console.log('Successfully created properties table!');
    
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
    
    // Insert the properties
    const { data, error: insertError } = await supabase
      .from('properties')
      .upsert(properties, { onConflict: 'property_id' });
    
    if (insertError) {
      console.error('Error inserting properties:', insertError);
      return;
    }
    
    console.log('Successfully seeded properties table!');
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the function
createPropertiesTable();
