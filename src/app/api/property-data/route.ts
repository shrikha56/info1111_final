import { NextResponse } from 'next/server';

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
    // TODO: Connect to Supabase when the properties table is properly set up
    // The properties table should have the following columns:
    // - property_id (text, primary key)
    // - property_name (text)
    // - property_address (text)
    // - unit_count (integer)
    // - maintenance_count (integer)
    // - last_inspection_date (date)
    //
    // For now, use the fallback data for reliability
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
