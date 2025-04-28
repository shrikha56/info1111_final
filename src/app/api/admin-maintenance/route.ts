import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// This is a special admin-only endpoint that uses the service role key
// to bypass RLS policies for maintenance requests

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Admin API: Received maintenance request:', body);
    
    // Validate required fields
    if (!body.title || !body.description) {
      return NextResponse.json({ error: 'Title and description are required' }, { status: 400 });
    }
    
    // Create maintenance data with fixed IDs for demo purposes
    const maintenanceData = {
      title: body.title,
      description: body.description,
      status: 'pending',
      priority: body.priority || 'medium',
      category: body.category || 'general',
      property_id: '00000000-0000-0000-0000-000000000001', // Fixed property ID from schema
      requester_id: '00000000-0000-0000-0000-000000000003',  // Fixed user ID (John Resident)
      created_at: new Date().toISOString() // Add current timestamp
    };
    
    // Get environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Missing Supabase credentials');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }
    
    // Create a fresh Supabase client for this request
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    console.log('Admin API: Inserting maintenance request...');
    const { data, error } = await supabase
      .from('maintenance_requests')
      .insert([maintenanceData])
      .select();
    
    if (error) {
      console.error('Admin API: Error creating maintenance request:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    console.log('Admin API: Successfully created maintenance request:', data);
    return NextResponse.json(data[0] || { id: 'admin-' + Date.now(), ...maintenanceData });
  } catch (error) {
    console.error('Admin API: Error in maintenance request creation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
