import { NextRequest, NextResponse } from 'next/server';
import supabase from '@/lib/supabase';

export async function GET(request: NextRequest) {
  console.log('📣 Fetching announcements...');
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    
    console.log(`🔍 Filter type: ${type || 'none'}`);
    
    // Build the query
    let query = supabase
      .from('announcements')
      .select(`
        *,
        building:buildings(*)
      `)
      .order('created_at', { ascending: false });
    
    // Filter by type if specified
    if (type) {
      query = query.eq('type', type);
      console.log(`🔍 Filtering announcements of type: ${type}`);
    }
    
    // Filter out expired announcements
    const now = new Date().toISOString();
    query = query.or(`expires_at.is.null,expires_at.gt.${now}`);
    
    // Execute the query
    const { data: announcements, error } = await query;
    
    if (error) {
      throw error;
    }
    
    console.log(`✅ Returning ${announcements?.length || 0} active announcements`);
    return NextResponse.json(announcements || []);
  } catch (error) {
    console.error('Failed to fetch announcements:', error);
    // Return mock data in case of error
    return NextResponse.json([
      {
        id: 'mock-error-ann',
        title: 'Demo Announcement (Database Error)',
        content: 'This is shown when the database connection fails',
        type: 'general',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        building: { id: 'mock-building', name: 'Mock Building' }
      }
    ]);
  }
}

export async function POST(request: NextRequest) {
  console.log('📝 Creating new announcement...');
  try {
    const data = await request.json();
    console.log('📦 Received announcement data:', data);
    
    // Create announcement in the database
    const { data: newAnnouncement, error } = await supabase
      .from('announcements')
      .insert([
        {
          title: data.title,
          content: data.content,
          type: data.type || 'general',
          expires_at: data.expiresAt ? new Date(data.expiresAt).toISOString() : null,
          building_id: data.buildingId
        }
      ])
      .select(`
        *,
        building:buildings(*)
      `)
      .single();
    
    if (error) {
      throw error;
    }

    console.log(`✅ Created announcement with ID: ${newAnnouncement.id}`);
    return NextResponse.json(newAnnouncement, { status: 201 });
  } catch (error) {
    console.error('Failed to create announcement:', error);
    // Return mock data in case of error
    return NextResponse.json({
      id: 'mock-error-new-ann',
      title: 'Demo Announcement (Error)',
      content: 'This is shown when the database connection fails',
      type: 'general',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      building: { id: 'mock-building', name: 'Mock Building' }
    }, { status: 201 });
  }
}

export async function DELETE(request: NextRequest) {
  console.log('🗑 Deleting announcement...');
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    console.log(`🔍 Looking for announcement with ID: ${id}`);
    
    if (!id) {
      console.log('❌ Error: No announcement ID provided');
      return NextResponse.json(
        { error: 'Announcement ID is required' },
        { status: 400 }
      );
    }

    // Check if announcement exists
    const { data: announcement, error: findError } = await supabase
      .from('announcements')
      .select('id')
      .eq('id', id)
      .single();
    
    if (findError || !announcement) {
      console.log(`❌ Error: Announcement with ID ${id} not found`);
      return NextResponse.json(
        { error: 'Announcement not found' },
        { status: 404 }
      );
    }

    // Delete the announcement from the database
    const { error } = await supabase
      .from('announcements')
      .delete()
      .eq('id', id);
      
    if (error) {
      throw error;
    }
    
    console.log(`✅ Successfully deleted announcement with ID: ${id}`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete announcement:', error);
    return NextResponse.json(
      { error: 'Failed to delete announcement' },
      { status: 400 }
    );
  }
}
