import { NextResponse } from 'next/server'
import supabase from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    // Parse the request body
    const requestData = await request.json()
    console.log('Received maintenance request data:', requestData)

    // Create a test maintenance request with fixed data
    const testData = {
      title: 'Test Maintenance Request',
      description: 'This is a test description from the API endpoint',
      status: 'pending',
      priority: 'medium',
      category: 'general',
      property_id: '00000000-0000-0000-0000-000000000001', // First property from schema
      requester_id: '00000000-0000-0000-0000-000000000003'  // John Resident from schema
    }

    // Insert the test maintenance request
    const { data, error } = await supabase
      .from('maintenance_requests')
      .insert([testData])
      .select('*')
      .single()

    if (error) {
      console.error('Error creating test maintenance request:', error)
      return NextResponse.json(
        { error: `Failed to create test request: ${error.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error('Error in test-maintenance API route:', error)
    return NextResponse.json(
      { error: `API error: ${error.message || 'Unknown error'}` },
      { status: 500 }
    )
  }
}
