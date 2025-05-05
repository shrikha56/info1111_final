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
    const { data: properties, error } = await supabase
      .from('properties')
      .select(`
        id,
        name,
        address,
        units,
        last_inspection
      `);
    
    if (error) {
      console.error('Error fetching properties from Supabase:', error);
      throw error;
    }
    
    // Fetch maintenance requests count for each property
    const propertiesWithMaintenance = await Promise.all(
      properties.map(async (property) => {
        const { count, error: countError } = await supabase
          .from('maintenance_requests')
          .select('id', { count: 'exact' })
          .eq('property_id', property.id);
        
        if (countError) {
          console.warn(`Error fetching maintenance requests for property ${property.id}:`, countError);
          return { ...property, maintenance_requests: 0 };
        }
        
        return { ...property, maintenance_requests: count || 0 };
      })
    );
    
    // If no properties were found, use fallback data
    const finalProperties = propertiesWithMaintenance.length > 0 
      ? propertiesWithMaintenance 
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
