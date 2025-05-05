import { NextRequest, NextResponse } from 'next/server';
import supabase from '@/lib/supabase';

// Define route segment config for static rendering
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { unit_number, address } = body;
    
    if (!unit_number || !address) {
      return NextResponse.json({ error: 'unit_number and address are required' }, { status: 400 });
    }
    
    // Insert the property into Supabase
    const { data, error } = await supabase
      .from('properties')
      .insert([{ unit_number, address }])
      .select();
    
    if (error) {
      console.error('Error inserting property:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error in insert property API:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
