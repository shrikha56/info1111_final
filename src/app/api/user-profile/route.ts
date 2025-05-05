import { NextRequest, NextResponse } from 'next/server';
import supabase from '@/lib/supabase';

// Define route segment config for static rendering
export const dynamic = 'force-dynamic';

// GET: Fetch user profile data
export async function GET(request: NextRequest) {
  try {
    // Get userId from searchParams without using request.url
    const userId = request.nextUrl.searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }
    
    console.log('Fetching user profile for ID:', userId);
    
    // Attempt to fetch user data with their properties
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
    
    // If there's an error or no user data, provide fallback data
    if (userError || !userData) {
      console.warn('Using fallback user data due to error:', userError || 'No user found');
      
      // Return fallback data for demo purposes
      return NextResponse.json({
        user: {
          id: userId || '00000000-0000-0000-0000-000000000003',
          name: 'John Resident',
          email: 'john@example.com',
          role: 'resident',
          created_at: new Date().toISOString(),
          properties: [
            {
              id: '00000000-0000-0000-0000-000000000001',
              unit_number: '101',
              address: '123 Sunset Blvd, Sydney, Unit 101',
              building: {
                id: '00000000-0000-0000-0000-000000000001',
                name: 'Sunset Towers',
                address: '123 Sunset Blvd, Sydney'
              }
            }
          ]
        },
        maintenanceRequests: [
          {
            id: 'mock-1',
            title: 'Leaking Faucet',
            description: 'The kitchen faucet is leaking.',
            status: 'pending',
            priority: 'medium',
            category: 'plumbing',
            created_at: new Date(Date.now() - 86400000).toISOString(),
            updated_at: new Date(Date.now() - 86400000).toISOString(),
            property: { unit_number: '101', address: '123 Sunset Blvd, Sydney, Unit 101' }
          },
          {
            id: 'mock-2',
            title: 'Light Fixture Replacement',
            description: 'The light fixture in the living room needs to be replaced.',
            status: 'completed',
            priority: 'low',
            category: 'electrical',
            created_at: new Date(Date.now() - 172800000).toISOString(),
            updated_at: new Date(Date.now() - 86400000).toISOString(),
            property: { unit_number: '101', address: '123 Sunset Blvd, Sydney, Unit 101' }
          }
        ],
        notifications: [
          {
            id: 'notif-1',
            title: 'Maintenance Request Update',
            message: 'Your maintenance request has been received.',
            is_read: false,
            created_at: new Date(Date.now() - 43200000).toISOString(),
            user_id: userId || '00000000-0000-0000-0000-000000000003'
          },
          {
            id: 'notif-2',
            title: 'Building Announcement',
            message: 'There will be scheduled maintenance on the elevators next Monday.',
            is_read: true,
            created_at: new Date(Date.now() - 172800000).toISOString(),
            user_id: userId || '00000000-0000-0000-0000-000000000003'
          }
        ]
      });
    }
    
    // If we have user data, try to fetch maintenance requests
    let maintenanceRequests = [];
    try {
      const { data: requests, error: maintenanceError } = await supabase
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
      
      if (!maintenanceError && requests) {
        maintenanceRequests = requests;
      } else {
        console.warn('Error fetching maintenance requests:', maintenanceError);
      }
    } catch (err) {
      console.error('Exception fetching maintenance requests:', err);
    }
    
    // Try to fetch notifications
    let notifications = [];
    try {
      const { data: notifs, error: notificationsError } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (!notificationsError && notifs) {
        notifications = notifs;
      } else {
        console.warn('Error fetching notifications:', notificationsError);
      }
    } catch (err) {
      console.error('Exception fetching notifications:', err);
    }
    
    // Format and return the complete user profile data
    return NextResponse.json({
      user: {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        created_at: userData.created_at,
        properties: userData.properties?.map((item: any) => item.property).filter(Boolean) || []
      },
      maintenanceRequests: maintenanceRequests,
      notifications: notifications
    });
  } catch (error) {
    console.error('Error in user profile API:', error);
    
    // Return fallback data in case of any error
    return NextResponse.json({
      user: {
        id: '00000000-0000-0000-0000-000000000003',
        name: 'John Resident',
        email: 'john@example.com',
        role: 'resident',
        created_at: new Date().toISOString(),
        properties: [
          {
            id: '00000000-0000-0000-0000-000000000001',
            unit_number: '101',
            address: '123 Sunset Blvd, Sydney, Unit 101',
            building: {
              id: '00000000-0000-0000-0000-000000000001',
              name: 'Sunset Towers',
              address: '123 Sunset Blvd, Sydney'
            }
          }
        ]
      },
      maintenanceRequests: [
        {
          id: 'fallback-1',
          title: 'Leaking Faucet',
          description: 'The kitchen faucet is leaking.',
          status: 'pending',
          priority: 'medium',
          category: 'plumbing',
          created_at: new Date(Date.now() - 86400000).toISOString(),
          updated_at: new Date(Date.now() - 86400000).toISOString(),
          property: { unit_number: '101', address: '123 Sunset Blvd, Sydney, Unit 101' }
        }
      ],
      notifications: [
        {
          id: 'fallback-notif-1',
          title: 'Maintenance Request Update',
          message: 'Your maintenance request has been received.',
          is_read: false,
          created_at: new Date(Date.now() - 43200000).toISOString(),
          user_id: '00000000-0000-0000-0000-000000000003'
        }
      ]
    });
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
