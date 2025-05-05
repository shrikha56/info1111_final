import { NextResponse } from 'next/server';
import supabase from '@/lib/supabase';

// Define route segment config for static rendering
export const dynamic = 'force-dynamic';

// Sample property data
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

export async function GET() {
  try {
    console.log('Seeding properties table...');
    
    // First, disable RLS for the properties table
    // This requires running a SQL command in the Supabase dashboard:
    // ALTER TABLE properties DISABLE ROW LEVEL SECURITY;
    
    // Insert the properties
    const { data, error } = await supabase
      .from('properties')
      .insert(properties)
      .select();
    
    if (error) {
      console.error('Error seeding properties:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Properties seeded successfully',
      data
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
