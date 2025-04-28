import { NextResponse } from 'next/server';

export async function GET() {
  console.log('GET /api/maintenance-test - Test endpoint');
  
  // Return mock data for testing
  return NextResponse.json([
    {
      id: 'test-1',
      title: 'Test Maintenance Request 1',
      description: 'This is a test maintenance request',
      status: 'pending',
      priority: 'medium',
      category: 'plumbing',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      property_id: '00000000-0000-0000-0000-000000000001',
      requester_id: '00000000-0000-0000-0000-000000000003',
      property: { unit_number: '101', address: '123 Sunset Blvd, Sydney, Unit 101' }
    },
    {
      id: 'test-2',
      title: 'Test Maintenance Request 2',
      description: 'Another test maintenance request',
      status: 'in_progress',
      priority: 'high',
      category: 'electrical',
      created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      updated_at: new Date(Date.now() - 86400000).toISOString(),
      property_id: '00000000-0000-0000-0000-000000000001',
      requester_id: '00000000-0000-0000-0000-000000000003',
      property: { unit_number: '101', address: '123 Sunset Blvd, Sydney, Unit 101' }
    }
  ]);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('POST /api/maintenance-test - Received data:', body);
    
    // Return success response with mock ID
    return NextResponse.json({
      id: 'test-' + Date.now(),
      ...body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      property_id: '00000000-0000-0000-0000-000000000001',
      requester_id: '00000000-0000-0000-0000-000000000003'
    });
  } catch (error) {
    console.error('Error in test maintenance request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
