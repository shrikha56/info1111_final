import { NextResponse } from 'next/server';

// Define route segment config for static rendering
export const dynamic = 'force-dynamic';

// Sample strata management data from the PHP file
const properties = [
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
    // Calculate summary statistics
    const totalProperties = properties.length;
    const totalUnits = properties.reduce((sum, property) => sum + property.units, 0);
    const totalMaintenanceRequests = properties.reduce(
      (sum, property) => sum + property.maintenance_requests, 
      0
    );
    
    // Return the property data and summary statistics
    return NextResponse.json({
      properties,
      summary: {
        totalProperties,
        totalUnits,
        totalMaintenanceRequests,
        averageUnitsPerProperty: Math.round(totalUnits / totalProperties),
        averageMaintenancePerProperty: (totalMaintenanceRequests / totalProperties).toFixed(1)
      }
    });
  } catch (error) {
    console.error('Error in property data API:', error);
    return NextResponse.json({ error: 'Failed to fetch property data' }, { status: 500 });
  }
}
