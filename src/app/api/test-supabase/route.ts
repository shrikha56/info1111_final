import { NextResponse } from 'next/server';
import supabase from '@/lib/supabase';

export async function GET() {
  try {
    // Test the Supabase connection by making a simple query
    const { data, error } = await supabase
      .from('maintenance_requests')
      .select('count')
      .limit(1)
      .single();
    
    if (error) {
      throw error;
    }
    
    return NextResponse.json({
      success: true,
      message: 'Successfully connected to Supabase',
      data
    });
  } catch (error) {
    console.error('Supabase connection test failed:', error);
    return NextResponse.json({
      success: false,
      message: `Failed to connect to Supabase: ${error.message}`,
      error: error.message
    });
  }
}
