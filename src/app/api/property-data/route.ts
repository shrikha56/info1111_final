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
    
    // Try to fetch properties from Supabase using the regular client
    const { data: propertiesData, error } = await supabase
      .from('properties')
      .select(`
        id,
        unit_number,
        address,
        created_at,
        updated_at
      `);
    
    if (error) {
      console.error('Error fetching properties from Supabase:', error);
      // Fall back to hardcoded data if there's an error
      return NextResponse.json({
        properties: fallbackProperties,
        summary: {
          totalProperties: fallbackProperties.length,
          totalUnits: fallbackProperties.reduce((sum, property) => sum + property.units, 0),
          totalMaintenanceRequests: fallbackProperties.reduce((sum, property) => sum + property.maintenance_requests, 0),
          averageUnitsPerProperty: Math.round(fallbackProperties.reduce((sum, property) => sum + property.units, 0) / fallbackProperties.length),
          averageMaintenancePerProperty: (fallbackProperties.reduce((sum, property) => sum + property.maintenance_requests, 0) / fallbackProperties.length).toFixed(1)
        }
      });
    }
    
    console.log('Properties data from Supabase:', propertiesData);
    
    // If we have properties data from Supabase, map it to the expected format
    // Otherwise, use the fallback data
    const finalProperties = propertiesData && propertiesData.length > 0
      ? propertiesData.map(property => ({
          id: property.id,
          name: `Property ${property.unit_number || 'Unit'}`,
          address: property.address || 'No address available',
          units: parseInt(property.unit_number) || 0,
          maintenance_requests: 0,
          last_inspection: property.updated_at?.split('T')[0] || '2025-04-15'
        }))
      : fallbackProperties;
    
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
