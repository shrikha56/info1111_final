import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// This is a special endpoint for Vercel deployment
// that handles environment variables differently

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Vercel API: Received maintenance request:', body);
    
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
    
    // Log environment variables for debugging (safe to log in server-side code)
    console.log('Supabase URL defined:', !!supabaseUrl);
    console.log('Supabase Anon Key defined:', !!supabaseAnonKey);
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Missing Supabase credentials in Vercel environment');
      
      // Return a mock response for demo purposes
      return NextResponse.json({
        id: 'vercel-' + Date.now(),
        ...maintenanceData,
        _note: 'This is a mock response as Supabase credentials are missing'
      });
    }
    
    // Create a fresh Supabase client for this request
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    console.log('Vercel API: Attempting to insert maintenance request...');
    
    // Try direct insert first
    try {
      const { data, error } = await supabase
        .from('maintenance_requests')
        .insert([maintenanceData])
        .select();
      
      if (!error) {
        console.log('Vercel API: Successfully created maintenance request via direct insert:', data);
        return NextResponse.json(data[0] || { id: 'vercel-direct-' + Date.now(), ...maintenanceData });
      }
      
      console.warn('Vercel API: Direct insert failed, trying RPC:', error.message);
    } catch (insertError) {
      console.warn('Vercel API: Direct insert exception:', insertError);
    }
    
    // Try RPC method as fallback
    try {
      const { data, error } = await supabase.rpc('insert_maintenance_request', {
        p_title: maintenanceData.title,
        p_description: maintenanceData.description,
        p_status: maintenanceData.status,
        p_priority: maintenanceData.priority,
        p_category: maintenanceData.category,
        p_property_id: maintenanceData.property_id,
        p_requester_id: maintenanceData.requester_id
      });
      
      if (!error) {
        console.log('Vercel API: Successfully created maintenance request via RPC:', data);
        return NextResponse.json(data || { id: 'vercel-rpc-' + Date.now(), ...maintenanceData });
      }
      
      console.warn('Vercel API: RPC method failed:', error.message);
    } catch (rpcError) {
      console.warn('Vercel API: RPC exception:', rpcError);
    }
    
    // If all database methods fail, return a mock response
    console.log('Vercel API: All database methods failed, returning mock response');
    return NextResponse.json({
      id: 'vercel-mock-' + Date.now(),
      ...maintenanceData,
      _note: 'This is a mock response as all database methods failed'
    });
  } catch (error) {
    console.error('Vercel API: Error in maintenance request creation:', error);
    return NextResponse.json({ 
      id: 'vercel-error-' + Date.now(),
      title: 'Error Request',
      description: 'An error occurred while creating the maintenance request',
      status: 'pending',
      created_at: new Date().toISOString(),
      _error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
