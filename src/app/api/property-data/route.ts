import { NextResponse } from 'next/server';
import supabase from '@/lib/supabase';

// Define route segment config for static rendering
export const dynamic = 'force-dynamic';

// Fallback property data in case database connection fails
const fallbackProperties = [
  {
    id: 'prop-001',
    name: 'Sunset Heights',
    address: '123 Sunset Blvd, Sydney, NSW 2000',
    units: 24,
    maintenance_requests: 3,
    last_inspection: '2025-04-15'
  },
  {
    id: 'prop-002',
    name: 'Harbour View Apartments',
    address: '45 Harbour St, Sydney, NSW 2000',
    units: 36,
    maintenance_requests: 5,
    last_inspection: '2025-04-22'
  },
  {
    id: 'prop-003',
    name: 'Parkside Residences',
    address: '78 Park Lane, Sydney, NSW 2010',
    units: 18,
    maintenance_requests: 1,
    last_inspection: '2025-04-28'
  }
];

export async function GET() {
  try {
    console.log('Fetching properties from Supabase...');
    
    // Fetch properties from Supabase
    // First, let's check the structure of the properties table
    console.log('Checking properties table structure...');
    const { data: tableInfo, error: tableError } = await supabase
      .from('properties')
      .select('*')
      .limit(1);
      
    if (tableError) {
      console.error('Error checking properties table:', tableError);
      throw tableError;
    }
    
    console.log('Properties table first row:', tableInfo);
    
    // Use fallback data for now until we determine the correct column names
    const properties = fallbackProperties;
    
    // No need to check for error since we're using fallback data directly
    
    // For now, use the fallback properties directly
    // We'll update this once we determine the correct column structure
    const finalProperties = fallbackProperties;
    
    // Calculate summary statistics
    const totalProperties = finalProperties.length;
    const totalUnits = finalProperties.reduce((sum, property) => sum + property.units, 0);
    const totalMaintenanceRequests = finalProperties.reduce(
      (sum, property) => sum + property.maintenance_requests, 
      0
    );
    
    // Return the property data and summary statistics
    return NextResponse.json({
      properties: finalProperties,
      summary: {
        totalProperties,
        totalUnits,
        totalMaintenanceRequests,
        averageUnitsPerProperty: totalProperties > 0 ? Math.round(totalUnits / totalProperties) : 0,
        averageMaintenancePerProperty: totalProperties > 0 ? (totalMaintenanceRequests / totalProperties).toFixed(1) : '0.0'
      }
    });
  } catch (error) {
    console.error('Error in property data API:', error);
    return NextResponse.json({ error: 'Failed to fetch property data' }, { status: 500 });
  }
}
