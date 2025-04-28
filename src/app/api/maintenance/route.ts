import { NextRequest, NextResponse } from 'next/server';
import supabase from '@/lib/supabase';

export async function GET() {
  try {
    const { data: maintenanceRequests, error } = await supabase
      .from('maintenance_requests')
      .select(`
        *,
        requester:users!maintenance_requests_requester_id_fkey(id, name, email),
        property:properties!maintenance_requests_property_id_fkey(id, unit_number, address)
      `)
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return NextResponse.json(maintenanceRequests);
  } catch (error) {
    console.error('Failed to fetch maintenance requests:', error);
    // Return mock data in case of error
    return NextResponse.json([
      {
        id: 'mock-error',
        title: 'Demo Request (Database Error)',
        description: 'This is shown when the database connection fails',
        status: 'PENDING',
        priority: 'MEDIUM',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        requester: { id: 'mock-user', name: 'Demo User', email: 'demo@example.com' },
        property: { id: 'mock-property', unit_number: '101', address: '123 Demo St' }
      }
    ]);
  }
}

export async function POST(request: NextRequest) {
  console.log(' Creating new maintenance request...');
  try {
    const data = await request.json();
    console.log(' Received maintenance request data:', data);
    
    // Validate required fields
    if (!data.title || !data.description || !data.requesterId || !data.propertyId) {
      console.log(' Error: Missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Check if user exists
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('id', data.requesterId)
      .single();
      
    if (userError || !user) {
      console.log(` Error: User with ID ${data.requesterId} not found`);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Check if property exists
    const { data: property, error: propertyError } = await supabase
      .from('properties')
      .select('id')
      .eq('id', data.propertyId)
      .single();
      
    if (propertyError || !property) {
      console.log(` Error: Property with ID ${data.propertyId} not found`);
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }
    
    // Create new maintenance request
    const { data: newRequest, error } = await supabase
      .from('maintenance_requests')
      .insert([
        {
          title: data.title,
          description: data.description,
          status: data.status || 'pending',
          priority: data.priority || 'medium',
          requester_id: data.requesterId,
          property_id: data.propertyId,
          images: data.images || [],
          category: data.category || 'general'
        }
      ])
      .select(`
        *,
        requester:users!maintenance_requests_requester_id_fkey(id, name, email),
        property:properties!maintenance_requests_property_id_fkey(id, unit_number, address)
      `)
      .single();
    
    if (error) {
      throw error;
    }
    
    console.log(` Created maintenance request with ID: ${newRequest.id}`);
    return NextResponse.json(newRequest, { status: 201 });
  } catch (error) {
    console.error('Failed to create maintenance request:', error);
    return NextResponse.json(
      { error: 'Failed to create maintenance request' },
      { status: 400 }
    );
  }
}

export async function PUT(request: NextRequest) {
  console.log(' Updating maintenance request...');
  try {
    const data = await request.json();
    console.log(' Received update data:', data);
    
    if (!data.id) {
      console.log(' Error: No request ID provided');
      return NextResponse.json(
        { error: 'Request ID is required' },
        { status: 400 }
      );
    }
    
    // Check if maintenance request exists
    const { data: existingRequest, error: findError } = await supabase
      .from('maintenance_requests')
      .select('id')
      .eq('id', data.id)
      .single();
      
    if (findError || !existingRequest) {
      console.log(` Error: Maintenance request with ID ${data.id} not found`);
      return NextResponse.json(
        { error: 'Maintenance request not found' },
        { status: 404 }
      );
    }
    
    // Update the request
    const updateData: any = {};
    
    // Only update fields that are provided
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.priority !== undefined) updateData.priority = data.priority;
    if (data.images !== undefined) updateData.images = data.images;
    if (data.category !== undefined) updateData.category = data.category;
    
    // Update the maintenance request
    const { data: updatedRequest, error } = await supabase
      .from('maintenance_requests')
      .update(updateData)
      .eq('id', data.id)
      .select(`
        *,
        requester:users!maintenance_requests_requester_id_fkey(id, name, email),
        property:properties!maintenance_requests_property_id_fkey(id, unit_number, address),
        comments:comments(*)
      `)
      .single();
    
    if (error) {
      throw error;
    }
    
    console.log(` Updated maintenance request with ID: ${updatedRequest.id}`);
    return NextResponse.json(updatedRequest);
  } catch (error) {
    console.error('Failed to update maintenance request:', error);
    return NextResponse.json(
      { error: 'Failed to update maintenance request' },
      { status: 400 }
    );
  }
}

// Add a DELETE function to delete maintenance requests
export async function DELETE(request: NextRequest) {
  console.log(' Deleting maintenance request...');
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    console.log(` Looking for maintenance request with ID: ${id}`);
    
    if (!id) {
      console.log(' Error: No request ID provided');
      return NextResponse.json(
        { error: 'Request ID is required' },
        { status: 400 }
      );
    }

    // Check if maintenance request exists
    const { data: existingRequest, error: findError } = await supabase
      .from('maintenance_requests')
      .select('id')
      .eq('id', id)
      .single();
      
    if (findError || !existingRequest) {
      console.log(` Error: Maintenance request with ID ${id} not found`);
      return NextResponse.json(
        { error: 'Maintenance request not found' },
        { status: 404 }
      );
    }

    // Delete the maintenance request
    const { error } = await supabase
      .from('maintenance_requests')
      .delete()
      .eq('id', id);
      
    if (error) {
      throw error;
    }
    
    console.log(` Successfully deleted maintenance request with ID: ${id}`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete maintenance request:', error);
    return NextResponse.json(
      { error: 'Failed to delete maintenance request' },
      { status: 400 }
    );
  }
}
