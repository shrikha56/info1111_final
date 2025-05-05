import { NextRequest, NextResponse } from 'next/server';
import supabase from '@/lib/supabase';

// GET: Fetch user profile data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }
    
    // Fetch user data with their properties
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select(`
        id, 
        name, 
        email, 
        role, 
        created_at,
        properties:user_properties(
          property:properties(
            id,
            unit_number,
            address,
            building:buildings(
              id,
              name,
              address
            )
          )
        )
      `)
      .eq('id', userId)
      .single();
    
    if (userError) {
      console.error('Error fetching user data:', userError);
      return NextResponse.json({ error: 'Failed to fetch user profile' }, { status: 500 });
    }
    
    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Fetch user's maintenance requests
    const { data: maintenanceRequests, error: maintenanceError } = await supabase
      .from('maintenance_requests')
      .select(`
        id,
        title,
        description,
        status,
        priority,
        category,
        created_at,
        updated_at,
        property:properties(unit_number, address)
      `)
      .eq('requester_id', userId)
      .order('created_at', { ascending: false });
    
    if (maintenanceError) {
      console.error('Error fetching maintenance requests:', maintenanceError);
    }
    
    // Fetch user's notifications
    const { data: notifications, error: notificationsError } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (notificationsError) {
      console.error('Error fetching notifications:', notificationsError);
    }
    
    // Format and return the complete user profile data
    return NextResponse.json({
      user: {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        created_at: userData.created_at,
        properties: userData.properties?.map((item: any) => item.property) || []
      },
      maintenanceRequests: maintenanceRequests || [],
      notifications: notifications || []
    });
  } catch (error) {
    console.error('Error in user profile API:', error);
    return NextResponse.json({ error: 'Failed to fetch user profile' }, { status: 500 });
  }
}

// PUT: Update user profile data
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }
    
    // Validate required fields
    if (!body.name || !body.email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }
    
    // Update user data
    const updateData = {
      name: body.name,
      email: body.email,
      // Only update role if provided and user is authorized (would require auth check in production)
      ...(body.role && { role: body.role })
    };
    
    const { data: updatedUser, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', body.id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating user profile:', error);
      return NextResponse.json({ error: 'Failed to update user profile' }, { status: 500 });
    }
    
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error in user profile update API:', error);
    return NextResponse.json({ error: 'Failed to update user profile' }, { status: 500 });
  }
}
